const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const route = require("./route");
const { addUser, findUser, getTotalUsers, removeUser } = require("./users");
const app = express();

const ADMIN_USERNAME = "Admin";

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

    const { user, isExist } = addUser({ username, room });

    let userMessage = isExist ? `Long time no see ${user.username}` : `Welcome ${user.username}`;

    socket.emit("message", {
      data: { user: { username: ADMIN_USERNAME }, message: userMessage },
    });

    socket.broadcast.to(user.room).emit("message", {
      data: { user: { username: ADMIN_USERNAME }, message: `${user.username} has joined the room.` },
    });

    io.to(user.room).emit("getUsers", { data: { userCount: getTotalUsers(user.room) } });
  });

  socket.on("sendMessage", ({ message, params }) => {
    const user = findUser(params);

    if (user) {
      io.to(user.room).emit("message", { data: { user, message } });
    }
  });

  socket.on("leftRoom", ({ params }) => {
    const user = findUser(params);

    if (user) {
      const {room, username} = removeUser(user);
      io.to(room).emit("message", { data: { user: {username: ADMIN_USERNAME}, message: `${username} has left the room.`} });
      io.to(room).emit("getUsers", { data: { userCount: getTotalUsers(room) } });
    }
  });

  io.on("disconnect", () => {
    console.log("Disconnected.");
  });
});

server.listen(4000, () => {
  console.log("server is running at port 4000.");
});
