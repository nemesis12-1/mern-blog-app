import mongoose from 'mongoose';

export const connectDB = async (MONGO_URI) => {
    
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
        console.log("Database connected successfully")
    } catch (error) {
        console.log(error.message)
    }
}