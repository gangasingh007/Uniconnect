import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const fileName = file.originalname.split('.')[0]; // base name
    const fileExt = file.originalname.split('.').pop(); // extension

    return {
      folder: 'resources',
      resource_type: 'raw',
      public_id: `${fileName}`,  // keep name without extension
      format: fileExt,           // ✅ force Cloudinary to add extension
    };
  },
});


export const upload = multer({ storage });
