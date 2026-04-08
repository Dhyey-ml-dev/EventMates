import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../store/eventSlice.js';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const PostEventPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.event);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    eventEndDate: '',
    startTime: '',
    endTime: '',
    roles: [{ title: '', count: 1, description: '' }],
    pay: { amount: 0, paymentType: 'fixed' },
    requirements: [],
    category: '',
  });

  const [requirementInput, setRequirementInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      pay: { ...prev.pay, [name]: name === 'amount' ? parseFloat(value) : value },
    }));
  };

  const handleRoleChange = (index, field, value) => {
    const newRoles = [...formData.roles];
    newRoles[index] = { ...newRoles[index], [field]: value };
    setFormData((prev) => ({ ...prev, roles: newRoles }));
  };

  const addRole = () => {
    setFormData((prev) => ({
      ...prev,
      roles: [...prev.roles, { title: '', count: 1, description: '' }],
    }));
  };

  const removeRole = (index) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index),
    }));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput],
      }));
      setRequirementInput('');
    }
  };

  const removeRequirement = (index) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    // For organizers, proceed to payment
    if (user?.role === 'organizer') {
      navigate('/payment/event-posting', {
        state: { eventData: formData },
      });
    } else {
      // Admin can post directly without payment
      try {
        const result = await dispatch(createEvent(formData));
        if (result.payload) {
          toast.success('Event created and published successfully!');
          navigate('/dashboard/admin');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to create event');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold mb-2">Post a New Event</h1>
          <p className="text-gray-600 mb-8">
            Fill in the details below to create your event posting
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-bold mb-4">Event Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Tech Conference 2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your event in detail"
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City/Venue"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Tech, Cultural, Sports"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div>
              <h2 className="text-xl font-bold mb-4">Date & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="eventEndDate"
                    value={formData.eventEndDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Compensation */}
            <div>
              <h2 className="text-xl font-bold mb-4">Compensation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.pay.amount}
                    onChange={handlePayChange}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Payment Type *
                  </label>
                  <select
                    name="paymentType"
                    value={formData.pay.paymentType}
                    onChange={handlePayChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="fixed">Fixed Amount</option>
                    <option value="hourly">Hourly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Roles */}
            <div>
              <h2 className="text-xl font-bold mb-4">Positions/Roles</h2>
              <div className="space-y-4">
                {formData.roles.map((role, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-gray-300 rounded-lg"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Role Title
                        </label>
                        <input
                          type="text"
                          value={role.title}
                          onChange={(e) =>
                            handleRoleChange(index, 'title', e.target.value)
                          }
                          placeholder="e.g., Event Coordinator"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Number of Positions
                        </label>
                        <input
                          type="number"
                          value={role.count}
                          onChange={(e) =>
                            handleRoleChange(index, 'count', parseInt(e.target.value))
                          }
                          min="1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>

                      {formData.roles.length > 1 && (
                        <div className="flex items-end">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            type="button"
                            onClick={() => removeRole(index)}
                            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                          >
                            Remove
                          </motion.button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Role Description
                      </label>
                      <textarea
                        value={role.description}
                        onChange={(e) =>
                          handleRoleChange(index, 'description', e.target.value)
                        }
                        placeholder="What will they be doing?"
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                type="button"
                onClick={addRole}
                className="mt-4 bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                + Add Another Role
              </motion.button>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-xl font-bold mb-4">Requirements</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  placeholder="e.g., Must be a college student"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="button"
                  onClick={addRequirement}
                  className="bg-primary text-white px-6 py-2 rounded-lg"
                >
                  Add
                </motion.button>
              </div>

              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
                  >
                    <span>{req}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Creating Event...' : 'Post Event'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PostEventPage;
