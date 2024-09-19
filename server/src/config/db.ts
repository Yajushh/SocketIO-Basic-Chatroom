import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`DB connection established`);
  } catch (error) {
    console.log(`DB connection ERROR : ${error}`);
    process.exit(1);
  }
};
