const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const route = require("./route");
const app = express();

app.use(cors({ origin: "*" }));
app.use(route);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }) => {
    socket.join(room);

    socket.emit("message", {
      data: { user: { username: "Admin"}, message: `greetings ${username}`}
    })
  });
  io.on("disconnect", () => {
    console.log("Disconnected");
  });
});

server.listen(4000, () => {
  console.log("server is running at port 4000");
});
