import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  socketId: string;
  room: string;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model<IUser>("User", UserSchema);
