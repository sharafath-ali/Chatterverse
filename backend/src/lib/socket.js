import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  }
})

io.on("connection", (socket) => {
  console.log("Connected to socket.io", socket.id);

  socket.on("disconnect", () => {
    console.log(socket.id)
  })
});

export { io, server, app }