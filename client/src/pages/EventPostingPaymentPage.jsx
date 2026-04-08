import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const EventPostingPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const eventData = location.state?.eventData;
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!eventData) {
      toast.error('Event data not found');
      navigate('/organizer/post-event');
    }
  }, [eventData, navigate]);

  const plans = {
    basic: {
      name: 'Basic Event Posting',
      amount: 299,
      description: 'Post your event and start receiving applications',
      features: ['Event posting', 'Applicant management', '30-day duration'],
      icon: '📌',
    },
    featured: {
      name: 'Featured Listing',
      amount: 599,
      description: 'Get more visibility with featured placement',
      features: ['Featured placement', 'Priority listing', 'Social media share', '30-day duration'],
      icon: '⭐',
    },
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please log in to continue');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create event first
      const eventResponse = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!eventResponse.ok) {
        throw new Error('Failed to create event');
      }

      const eventResult = await eventResponse.json();
      const createdEventId = eventResult.data.event._id;

      // Step 2: Initiate payment for event posting
      const paymentResponse = await fetch(`${API_BASE_URL}/payments/events/initiate-event-posting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          eventId: createdEventId,
          planType: selectedPlan,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to initiate payment');
      }

      const paymentData = await paymentResponse.json();
      const { razorpayOrder, payment } = paymentData.data;

      // Step 3: Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: 'INR',
        order_id: razorpayOrder.id,
        name: 'EventMates',
        description: plans[selectedPlan].description,
        image: '/logo.svg',
        prefill: {
          name: user?.firstName + ' ' + user?.lastName,
          email: user?.email,
          contact: user?.phone || '',
        },
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(`${API_BASE_URL}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            toast.success(`Payment successful! Event ${selectedPlan === 'featured' ? 'featured and ' : ''}published!`);
            navigate(`/events/${createdEventId}`);
          } catch (error) {
            toast.error('Payment verification failed: ' + error.message);
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.message || 'Payment initialization failed');
      setIsProcessing(false);
    }
  };

  if (!eventData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
          <p className="text-lg text-gray-600">
            Select a plan to publish your event and start receiving applications
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {Object.entries(plans).map(([key, plan], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedPlan(key)}
              className={`cursor-pointer rounded-2xl p-8 transition-all duration-300 ${
                selectedPlan === key
                  ? 'bg-primary text-white shadow-2xl transform scale-105'
                  : 'bg-white text-gray-900 shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Icon */}
              <div className="text-5xl mb-4">{plan.icon}</div>

              {/* Plan Name */}
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>

              {/* Description */}
              <p className={`mb-6 ${selectedPlan === key ? 'text-white/90' : 'text-gray-600'}`}>
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold">₹{plan.amount}</span>
                <span className={`ml-2 text-sm ${selectedPlan === key ? 'text-white/80' : 'text-gray-600'}`}>
                  one-time
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className={`text-xl ${selectedPlan === key ? '' : 'text-primary'}`}>
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Selection Indicator */}
              {selectedPlan === key && (
                <div className="text-center font-semibold">
                  Selected Plan
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6 pb-6 border-b">
            <div className="flex justify-between">
              <span className="text-gray-600">Event Title:</span>
              <span className="font-semibold">{eventData.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-semibold">{plans[selectedPlan].name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold">30 days</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total Amount:</span>
            <span className="text-primary">₹{plans[selectedPlan].amount}</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            disabled={isProcessing}
            className="flex-1 bg-gray-300 text-gray-900 py-4 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50 transition-colors"
          >
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 bg-primary text-white py-4 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin">⏳</span> Processing...
              </>
            ) : (
              <>
                💳 Pay ₹{plans[selectedPlan].amount}
              </>
            )}
          </motion.button>
        </div>

        {/* Terms */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-600 text-sm mt-8"
        >
          By proceeding, you agree to our Terms of Service and Privacy Policy.
          Your payment is secure and encrypted.
        </motion.p>
      </div>
    </div>
  );
};

export default EventPostingPaymentPage;
