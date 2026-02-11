import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path'
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(localFilePath) {
    try {
        // Validation
        if (!localFilePath || !fs.existsSync(localFilePath)) {
            console.error('File not found:', localFilePath);
            return null;
        }

        const uploadResult = await cloudinary.uploader.upload(localFilePath,{
            resource_type: 'auto',
            folder: 'ecobazar/products'
        });

        fs.unlinkSync(localFilePath);
        // console.log('uploadResult:', uploadResult);

        return uploadResult.secure_url;
    } catch (error) {
        console.error('Cloudinary upload failed:', error);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
}


async function deleteFromCloudinary(imageUrl) {
    try {
        // Extract public_id from URL
        // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.jpg
        const fileNameWithExtension = path.basename(imageUrl);
        const publicId = `ecobazar/products/${fileNameWithExtension.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId);
        // console.log('Deleted from cloudinary successfully:', publicId);
    } catch (error) {
        console.error('Cloudinary delete failed', error);
    }
}

export { uploadToCloudinary, deleteFromCloudinary };