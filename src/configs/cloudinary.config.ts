import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { IExpressRequest } from 'src/types';
import * as dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: IExpressRequest, file: Express.Multer.File) => {
    const { _id } = req.user;
    // Determine the folder based on file properties or request data

    let folder: string;
    if (file.fieldname === 'avatar') {
      folder = 'avatars';
    } else if (file.fieldname === 'documents') {
      folder = 'documents';
    } else {
      folder = 'misc';
    }
    return {
      folder: folder,
      allowed_formats: ['jpg', 'png'], // Adjust the allowed formats as needed
      public_id: _id, // Use original filename as the public ID
      transformation: [
        { gravity: 'face', height: 400, width: 400, crop: 'crop' },
        { radius: 'max' },
        { width: 200, crop: 'scale' },
        { fetch_format: 'auto' },
      ],
    };
  },
});
