import { Server, Socket } from "socket.io";
import { User } from "../models/User";
import { Message } from "../models/Message";

export const chatController = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`New socket connection established : ${socket.id}`);

    socket.on("joinRoom", async ({ username, roomName }) => {
      try {
        let user = await User.findOne({ socketId: socket.id });
        if (user) {
          socket.leave(roomName);
          user.room = roomName;
          await user.save();
        } else {
          user = new User({ username, socketId: socket.id, room: roomName });
          await user.save();
        }
        socket.join(roomName);
        console.log(`${username} joined room : ${roomName}`);
        io.in(roomName).emit("userJoined", username);
        const oldMessages = await Message.find({ roomName }).sort({
          timestamp: 1,
        });
        socket.emit("chatHistory", oldMessages);
      } catch (error) {
        console.log(`Error during socket connection : ${error}`);
      }
    });

    socket.on("chatMessage", async ({ username, roomName, message }) => {
      try {
        const newMessage = await Message.create({
          username,
          roomName,
          message,
          timestamp: new Date(),
        });
        io.to(roomName).emit("message", newMessage);
      } catch (error) {
        console.log(`Error sending message: ${error}`);
      }
    });

    socket.on("leaveRoom", async ({ username, roomName }) => {
      try {
        const user = await User.findOne({ socketId: socket.id });
        if (user) {
          socket.leave(roomName);
          io.to(roomName).emit("userLeft", username);
          await User.deleteOne({ socketId: socket.id });
        }
        console.log(`User ${username} has left the room.`);
      } catch (error) {
        console.log(`Error while leaving the room: ${error}`);
      }
    });
  });
};
