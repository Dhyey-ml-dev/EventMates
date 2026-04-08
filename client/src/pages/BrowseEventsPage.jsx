import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEvents } from '../store/eventSlice.js';
import { EventCard } from '../components/EventCard.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const BrowseEventsPage = () => {
  const dispatch = useDispatch();
  const { events, isLoading, pagination } = useSelector((state) => state.event);
  const [filters, setFilters] = useState({
    location: '',
    minPay: '',
    maxPay: '',
    search: '',
    page: 1,
  });

  useEffect(() => {
    dispatch(getAllEvents({ ...filters, status: 'published' }));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleApply = (eventId) => {
    // TODO: Implement apply functionality
    toast.success('Applied to event!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-56 bg-gradient-to-r from-primary to-secondary overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1540575467063-cff88566dae1?w=1200&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full max-w-7xl mx-auto flex flex-col items-center justify-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white text-center"
          >
            Discover Amazing Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/90 mt-3 text-center max-w-2xl"
          >
            Browse hundreds of volunteer opportunities and find the perfect event for you
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search events..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City or area"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Min Pay (₹)
              </label>
              <input
                type="number"
                name="minPay"
                value={filters.minPay}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Max Pay (₹)
              </label>
              <input
                type="number"
                name="maxPay"
                value={filters.maxPay}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No events found</p>
            <p className="text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onApply={handleApply}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (page) => (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, page }))
                      }
                      className={`px-4 py-2 rounded-lg ${
                        pagination.currentPage === page
                          ? 'bg-primary text-white'
                          : 'bg-white border border-gray-300'
                      }`}
                    >
                      {page}
                    </motion.button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseEventsPage;
