import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { chatController } from "./controllers/chat";

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    methods: ["GET", "POST"],
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(express.json());
app.use(cors());

connectDB();
chatController(io);

const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
  console.log(`HTTP Server is running at port : ${PORT}`);
});
