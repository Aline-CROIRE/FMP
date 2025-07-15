// src/utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { config } from '../config/config';

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
});

// Configure multer storage to use Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'fmp-avatars', // The name of the folder in Cloudinary to store images
        allowed_formats: ['jpg', 'jpeg', 'png'],
        // You can add transformations here if you want
        // transformation: [{ width: 500, height: 500, crop: 'limit' }]
    } as any, // Use 'as any' to bypass a known type issue with the library
});

export { cloudinary, storage };