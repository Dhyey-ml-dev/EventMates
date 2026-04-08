import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (fileBuffer, folder = 'eventmates') => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    );
    
    return result;
  } catch (error) {
    console.error(`❌ Cloudinary upload failed: ${error.message}`);
    throw error;
  }
};

export default cloudinary;
