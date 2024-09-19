import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  username: string;
  roomName: string;
  message: string;
  timestamp: Date;
}

const MessageSchema = new Schema({
  username: { type: String, required: true },
  roomName: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
});

export const Message = mongoose.model<IMessage>("Message", MessageSchema);
