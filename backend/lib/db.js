import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB=async(req,res)=>{

    try {
        const connect=await mongoose.connect(process.env.MONGODB_URL)
        console.log('MongoDB connected successfully',connect.connection.host,' ',connect.connection.name);
    } catch (error) {
        console.error('MongoDB connection failed',error);
    }
}

export default connectDB;