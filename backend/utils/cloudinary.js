import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary with public access.
 * @param {Buffer} fileBuffer - The buffer of the file to upload.
 * @param {string} folder - The folder in Cloudinary to upload the file to.
 * @returns {Promise<object>} - A promise that resolves with the upload result.
 */
const uploadFromBuffer = (fileBuffer, folder) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto', // Detects file type (image, pdf, etc.)
          access_mode: 'public',   //  <-- Ensures the file is publicly accessible
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  };
export { cloudinary, uploadFromBuffer };
