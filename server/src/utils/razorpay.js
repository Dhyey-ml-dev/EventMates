import Razorpay from 'razorpay';

let razorpayInstance = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export const createOrder = async (amount, currency = 'INR', receipt = '') => {
  try {
    if (!razorpayInstance) {
      throw new Error('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
    }
    const options = {
      amount: amount * 100, // Convert to smallest unit (paise)
      currency,
      receipt,
    };
    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay order creation failed:', error.message);
    throw error;
  }
};

export const verifyPaymentSignature = (orderId, paymentId, signature, secret = process.env.RAZORPAY_KEY_SECRET) => {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
};

export default {
  razorpayInstance,
  createOrder,
  verifyPaymentSignature,
};
