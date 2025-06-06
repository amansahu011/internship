const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with frontend URL when deploying
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// In-memory data store (can be replaced with DB later)
let boardState = {
  columns: {},
  tasks: {},
};

io.on("connection", (socket) => {
  console.log(" Client connected:", socket.id);

  // Send current board state to the new client
  socket.emit("board_state", boardState);

  // Receive board updates from a client
  socket.on("update_board", (newState) => {
    boardState = newState;

    // Broadcast updated board state to all other clients
    socket.broadcast.emit("board_state", boardState);
  });

  socket.on("disconnect", () => {
    console.log(" Client disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
