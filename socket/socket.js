
// ===== socket/socket.js =====
import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import { sendMessage as sendMsgController } from "../controllers/message.controller.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // { userId: socketId }

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];
export const getIO = () => io;

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("sendNotification", ({ receiverId, notification }) => {
    const recvSock = getReceiverSocketId(receiverId);
    if (recvSock) io.to(recvSock).emit("receiveNotification", notification);
  });

 socket.on("sendMessage", async ({ token, receiverId, message }) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const senderId = decoded.id;
    
    const req = {
      body: { message },
      params: { id: receiverId },
      user: { _id: senderId },
    };
    const res = { 
      status: (code) => ({ 
        json: (data) => {
          // After successful save, emit to receiver
          const receiverSocketId = getReceiverSocketId(receiverId);
          if (receiverSocketId && data._id) {
            io.to(receiverSocketId).emit("newMessage", data);
            
            // Also emit unread count update
            Message.countDocuments({
              receiverId,
              senderId,
              read: false,
            }).then(unreadCount => {
              io.to(receiverSocketId).emit("updateUnreadCount", {
                userId: senderId,
                unreadCount,
              });
            });
          }
          return data;
        } 
      }) 
    };
    
    await sendMsgController(req, res);
  } catch (err) {
    console.log("Socket sendMessage error:", err.message);
  }
});

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server };
