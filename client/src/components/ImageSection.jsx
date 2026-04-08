import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { optimizeImageUrl, getDefaultImage } from '../utils/imageUtils.js';

/**
 * ImageSection Component
 * Alternates between image and text for visual storytelling
 * Features:
 * - Responsive layout (image on right/left)
 * - Lazy loading
 * - Hover effects
 * - Mobile-friendly
 */
export const ImageSection = ({
  image,
  imageAlt = 'Section image',
  title,
  description,
  features,
  reverse = false,
  buttons,
  category = 'event',
  imageHeight = 'h-96',
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const finalImage = image || getDefaultImage(category);

  return (
    <section className="py-16 px-4 md:py-20">
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${reverse ? 'md:grid-cols-2 md:auto-cols-fr' : ''}`}>
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={reverse ? 'md:order-2' : 'md:order-1'}
          >
            <div className={`relative ${imageHeight} rounded-2xl overflow-hidden shadow-lg group bg-gray-200`}>
              {/* Image */}
              <img
                src={optimizeImageUrl(finalImage, 600, 80)}
                alt={imageAlt}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Loading skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={reverse ? 'md:order-1' : 'md:order-2'}
          >
            {/* Title */}
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                {title}
              </h2>
            )}

            {/* Description */}
            {description && (
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {description}
              </p>
            )}

            {/* Features List */}
            {features && features.length > 0 && (
              <div className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary/10">
                        <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      {feature.description && (
                        <p className="text-gray-600 mt-1">{feature.description}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Buttons */}
            {buttons && buttons.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {buttons.map((button, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={button.onClick}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      button.variant === 'secondary'
                        ? 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                        : 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90'
                    }`}
                  >
                    {button.label}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImageSection;
