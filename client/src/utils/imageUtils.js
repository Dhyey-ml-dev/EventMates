/**
 * Image Utility Functions
 * Handles image optimization, fallbacks, and placeholder generation
 */

// Unsplash API Configuration
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'demo_key';

// Default placeholder images for different categories
const DEFAULT_IMAGES = {
  event: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80', // Event venue
  volunteer: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', // Team collaboration
  tech: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', // Tech event
  social: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', // Social event
  education: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', // Education
  environment: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80', // Environment
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80', // Sports
  cultural: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80', // Cultural
  profile: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', // Profile placeholder
  organizer: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', // Team
  hero: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', // Hero section
};

/**
 * Get default image for a category
 */
export const getDefaultImage = (category = 'event') => {
  return DEFAULT_IMAGES[category] || DEFAULT_IMAGES.event;
};

/**
 * Optimize image URL for better performance
 * Adds query parameters for resizing, quality, and format
 */
export const optimizeImageUrl = (url, width = 800, quality = 80) => {
  if (!url) return null;

  // For Unsplash images, add optimization params
  if (url.includes('unsplash.com')) {
    return `${url}&w=${width}&q=${quality}&fit=crop`;
  }

  // For Cloudinary images
  if (url.includes('cloudinary.com')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      return `${parts[0]}/upload/w_${width},q_${quality},f_auto/${parts[1]}`;
    }
  }

  // For other images, return as is
  return url;
};

/**
 * Search Unsplash for images
 */
export const searchUnsplashImages = async (query, count = 6) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&count=${count}&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();
    return data.results.map((img) => ({
      url: img.urls.regular,
      thumb: img.urls.small,
      alt: img.alt_description || query,
      photographer: img.user.name,
    }));
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    return [];
  }
};

/**
 * Get random event images
 */
export const getRandomEventImage = () => {
  const eventImages = [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    'https://images.unsplash.com/photo-1501281668479-f3cf2d4260cd?w=800&q=80',
    'https://images.unsplash.com/photo-1535016120754-fd45c1d54a0f?w=800&q=80',
    'https://images.unsplash.com/photo-1540575467063-cff88566dae1?w=800&q=80',
  ];
  return eventImages[Math.floor(Math.random() * eventImages.length)];
};

/**
 * Convert file to base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Compress image before upload
 */
export const compressImage = async (file, maxWidth = 1200, maxHeight = 900) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/webp', 0.8);
      };
    };
  });
};

/**
 * Create a blurred placeholder image for lazy loading
 */
export const generatePlaceholder = (width = 10, height = 10) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Create a subtle gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#e5e7eb');
  gradient.addColorStop(1, '#d1d5db');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/webp');
};

/**
 * Get image aspect ratio class
 */
export const getImageAspectClass = (ratio = '16/9') => {
  const ratios = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
    '3/2': 'aspect-[3/2]',
  };
  return ratios[ratio] || ratios['16/9'];
};

/**
 * Format image size display
 */
export const formatImageSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export default {
  getDefaultImage,
  optimizeImageUrl,
  searchUnsplashImages,
  getRandomEventImage,
  fileToBase64,
  compressImage,
  generatePlaceholder,
  getImageAspectClass,
  formatImageSize,
};
