import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGOOSE_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}