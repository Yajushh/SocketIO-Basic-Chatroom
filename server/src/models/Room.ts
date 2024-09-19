import mongoose, { Schema, Document } from "mongoose";
import { IMessage } from "./Message";

interface IRoom extends Document {
  roomName: string;
  messages: IMessage[];
}

const RoomSchema = new Schema({
  roomName: { type: String, required: true },
  messages: [{ type: String }],
});

export const Room = mongoose.model<IRoom>("Room", RoomSchema);
