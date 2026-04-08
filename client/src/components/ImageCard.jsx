import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { optimizeImageUrl, getDefaultImage, generatePlaceholder } from '../utils/imageUtils.js';

/**
 * Reusable Image Card Component
 * Features:
 * - Lazy loading
 * - Blur-up effect
 * - Fallback placeholder
 * - Hover effects
 * - Accessibility support
 * - Responsive design
 */
export const ImageCard = ({
  src,
  alt = 'Image',
  title,
  category = 'event',
  aspectRatio = '16/9',
  showOverlay = false,
  overlayText,
  onClick,
  className = '',
  imageClassName = '',
  containerClassName = '',
  loading = 'lazy',
  errorCallback,
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [blurDataUrl, setBlurDataUrl] = useState(null);

  // Get aspect ratio classes
  const getAspectClass = () => {
    const ratios = {
      '16/9': 'aspect-video',
      '4/3': 'aspect-[4/3]',
      '1/1': 'aspect-square',
      '3/2': 'aspect-[3/2]',
      '2/3': 'aspect-[2/3]',
    };
    return ratios[aspectRatio] || ratios['16/9'];
  };

  useEffect(() => {
    const finalSrc = src || getDefaultImage(category);
    setImageSrc(finalSrc);

    // Generate blur placeholder
    try {
      const placeholder = generatePlaceholder(10, 10);
      setBlurDataUrl(placeholder);
    } catch (e) {
      console.warn('Could not generate placeholder:', e);
    }
  }, [src, category]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    const fallbackSrc = getDefaultImage(category);
    if (fallbackSrc !== imageSrc) {
      setImageSrc(fallbackSrc);
    }
    errorCallback?.();
  };

  const optimizedSrc = optimizeImageUrl(imageSrc, 800, 80);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl ${getAspectClass()} bg-gray-200 cursor-pointer group ${containerClassName}`}
    >
      {/* Blur background (while loading) */}
      {isLoading && blurDataUrl && (
        <div
          className="absolute inset-0 bg-cover blur-md"
          style={{
            backgroundImage: `url('${blurDataUrl}')`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Image */}
      <img
        src={optimizedSrc}
        alt={alt}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${imageClassName}`}
      />

      {/* Overlay */}
      {showOverlay && (
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {overlayText && (
            <div className="text-center">
              <p className="text-white text-sm font-medium">{overlayText}</p>
            </div>
          )}
        </div>
      )}

      {/* Title (optional) */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-white font-semibold line-clamp-2">{title}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}

      {/* Error state */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <p className="text-gray-600 text-sm">Image unavailable</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ImageCard;
