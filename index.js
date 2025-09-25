import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import socketHandler from "./socket/socket.js";
//https://admin.socket.io/#/
import { instrument } from "@socket.io/admin-ui";

import authRouter from "./routes/authRoutes.js";
import conversationRouter from "./routes/conversationRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  // send a test message to client
  socket.emit("message", "Hello from server!");
});

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {

  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token != null) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (decoded != null) {
        console.log("Decoded JWT:", decoded);
        req.user = decoded;
        next();
      }
      else {
        console.error("JWT Verification Error:", err);
      }
    });
  } else {
    next();
  }
});

app.use("/api/auth", authRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// ✅ Socket.IO Events
// socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

instrument(io, {
  auth: false,
});
