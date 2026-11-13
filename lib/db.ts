import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/notes-app")
        
        console.log("Connection Successful!!")
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error))
    }
}