import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDefaultImage, optimizeImageUrl } from '../utils/imageUtils.js';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, IndianRupee, ArrowUpRight, Star, Clock, CheckCircle } from 'lucide-react';

export const EventCard = ({ event, onApply }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const finalSrc = event.eventImage || getDefaultImage(event.category || 'event');
    setImageSrc(optimizeImageUrl(finalSrc, 600, 80));
  }, [event.eventImage, event.category]);

  const handleImageError = () => {
    setImageSrc(getDefaultImage(event.category || 'event'));
  };

  const categoryColors = {
    'Technology': 'bg-blue-50 text-blue-700 border-blue-200',
    'Entertainment': 'bg-pink-50 text-pink-700 border-pink-200',
    'Sports': 'bg-orange-50 text-orange-700 border-orange-200',
    'Social Service': 'bg-teal-50 text-teal-700 border-teal-200',
    'Corporate': 'bg-slate-100 text-slate-700 border-slate-200',
    'Food & Beverage': 'bg-amber-50 text-amber-700 border-amber-200',
    'Events': 'bg-purple-50 text-purple-700 border-purple-200',
    'Business': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  const categoryColor = categoryColors[event.category] || 'bg-slate-50 text-slate-700 border-slate-200';

  const formatDate = (date) => {
    if (!date) return 'TBA';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const truncateLocation = (loc) => {
    if (!loc) return '';
    return loc.length > 40 ? loc.substring(0, 37) + '...' : loc;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 group h-full flex flex-col border border-slate-200"
    >
      {/* Image Container */}
      <div className="relative h-48 bg-slate-100 overflow-hidden flex-shrink-0">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={event.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}

        {/* Pay Badge - Bottom */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          <div className="bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1.5 rounded-lg font-bold text-sm shadow-sm flex items-center gap-1 border border-white/20">
            <IndianRupee className="w-3.5 h-3.5 stroke-[3]" />
            {event.pay?.amount?.toLocaleString('en-IN') || 0}
            <span className="text-slate-500 font-medium text-[10px] uppercase tracking-wider ml-0.5">
              {event.pay?.paymentType === 'hourly' ? '/hr' : 'Total'}
            </span>
          </div>
        </div>

        {/* Badges - Top */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
          {event.isFeatured && (
            <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold shadow-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
            </span>
          )}
          {event.isVerified && (
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold shadow-sm flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category */}
        {event.category && (
          <div className="mb-3">
             <span className={`inline-block border px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${categoryColor}`}>
              {event.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold mb-2 text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-slate-500 text-sm line-clamp-2 mb-5 leading-relaxed font-light">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2.5 mb-6 mt-auto border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2.5 text-sm text-slate-600 font-light">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="truncate">{truncateLocation(event.location)}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-600 font-light">
            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>{formatDate(event.eventDate)}</span>
          </div>
          {event.applicants && event.applicants.length > 0 && (
            <div className="flex items-center gap-2.5 text-sm text-slate-600 font-light">
              <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{event.applicants.length} candidates applied</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/events/${event._id}`)}
            className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-center font-medium text-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-1.5"
          >
            Review Details
          </button>
          {onApply && (
            <button
              onClick={() => onApply(event._id)}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5"
            >
              Apply Now
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
