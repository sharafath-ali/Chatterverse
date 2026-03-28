import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  }
})

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ── WebRTC Video Call Signaling ──────────────────────────────

  // Caller initiates a call to a specific user
  socket.on("call:initiate", ({ to, from, callerName, callerProfilePic, callType }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:incoming", {
        from,
        callerName,
        callerProfilePic,
        callType, // "video" or "audio"
      });
    } else {
      // Receiver is offline
      socket.emit("call:unavailable", { to });
    }
  });

  // Receiver accepts the call
  socket.on("call:accept", ({ to }) => {
    const callerSocketId = userSocketMap[to];
    if (callerSocketId) {
      io.to(callerSocketId).emit("call:accepted", { from: userId });
    }
  });

  // Either party rejects/cancels the call
  socket.on("call:reject", ({ to }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("call:rejected", { from: userId });
    }
  });

  // Forward SDP offer from caller to receiver
  socket.on("call:offer", ({ to, offer }) => {
    const receiverSocketId = userSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call:offer", { from: userId, offer });
    }
  });

  // Forward SDP answer from receiver to caller
  socket.on("call:answer", ({ to, answer }) => {
    const callerSocketId = userSocketMap[to];
    if (callerSocketId) {
      io.to(callerSocketId).emit("call:answer", { from: userId, answer });
    }
  });

  // Forward ICE candidates between peers
  socket.on("call:ice-candidate", ({ to, candidate }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("call:ice-candidate", { from: userId, candidate });
    }
  });

  // Either party ends the call
  socket.on("call:end", ({ to }) => {
    const targetSocketId = userSocketMap[to];
    if (targetSocketId) {
      io.to(targetSocketId).emit("call:ended", { from: userId });
    }
  });

  // ── End WebRTC Signaling ─────────────────────────────────────

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })
});

export { io, app, server };