import Payment from '../models/Payment.js';
import Event from '../models/Event.js';
import { createOrder } from '../utils/razorpay.js';
import crypto from 'crypto';

export const initiatePayment = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const { amount, paymentType, eventId, studentId, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }

    // Create Razorpay order
    const order = await createOrder(amount, 'INR', `${paymentType}-${Date.now()}`);

    // Create payment record in DB
    const payment = await Payment.create({
      organizerId,
      studentId,
      eventId,
      paymentType,
      amount,
      paymentStatus: 'pending',
      razorpayOrderId: order.id,
      description,
    });

    return res.status(201).json({
      success: true,
      message: 'Payment initiated',
      data: {
        payment,
        razorpayOrder: order,
      },
    });
  } catch (error) {
    console.error('Initiate payment error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Update payment status
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        paymentStatus: 'completed',
        razorpayPaymentId,
        razorpaySignature,
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // If this is an event posting payment, update event status
    if (payment.paymentType === 'event-posting' && payment.eventId) {
      await Event.findByIdAndUpdate(
        payment.eventId,
        {
          paymentStatus: 'paid',
          status: 'published',
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment,
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
    });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    let query = { organizerId };
    if (status) query.paymentStatus = status;

    const skip = (page - 1) * limit;
    const payments = await Payment.find(query)
      .populate('studentId', 'firstName lastName email')
      .populate('eventId', 'title')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        payments,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get payment history error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
    });
  }
};

export const refundPayment = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const { paymentId } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.organizerId.toString() !== organizerId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to refund this payment',
      });
    }

    if (payment.paymentStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed payments can be refunded',
      });
    }

    // In production, call Razorpay refund API
    payment.paymentStatus = 'refunded';
    payment.metadata = { ...payment.metadata, refundReason: reason };
    await payment.save();

    return res.status(200).json({
      success: true,
      message: 'Payment refunded successfully',
      data: {
        payment,
      },
    });
  } catch (error) {
    console.error('Refund payment error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to refund payment',
    });
  }
};

export default {
  initiatePayment,
  verifyPayment,
  getPaymentHistory,
  refundPayment,
};

export const initiateEventPostingPayment = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const { eventId, planType } = req.body;

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check ownership
    if (event.organizerId.toString() !== organizerId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to pay for this event',
      });
    }

    // Define pricing
    const pricing = {
      basic: { amount: 299, description: 'Basic Event Posting' },
      featured: { amount: 599, description: 'Featured Event (with boost)' },
    };

    const plan = pricing[planType] || pricing.basic;
    const amount = plan.amount;

    // Create Razorpay order
    const order = await createOrder(amount, 'INR', `event-posting-${eventId}-${Date.now()}`);

    // Create payment record in DB
    const payment = await Payment.create({
      organizerId,
      eventId,
      paymentType: 'event-posting',
      amount,
      paymentStatus: 'pending',
      razorpayOrderId: order.id,
      description: plan.description,
    });

    // Mark event as featured if premium plan
    if (planType === 'featured') {
      await Event.findByIdAndUpdate(eventId, { isFeatured: true });
    }

    return res.status(201).json({
      success: true,
      message: 'Event posting payment initiated',
      data: {
        payment,
        razorpayOrder: order,
        planType,
        amount,
      },
    });
  } catch (error) {
    console.error('Initiate event posting payment error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
    });
  }
};
