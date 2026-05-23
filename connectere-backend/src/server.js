require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { Server } = require("socket.io");

const Message = require("./models/Messages");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let onlineUsers = [];
let rooms = ["general", "gaming", "study"];

//Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  //Create room
  socket.emit("room_list", rooms);
  socket.on("create_room", (roomName) => {
    if (!rooms.includes(roomName)) {
      rooms.push(roomName);
      io.emit("room_list", rooms);
    }
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
    console.log(`User ${socket.id} left room ${room}`);
  });

  //Join room
  socket.on("join_room", ({ room, username, avatar }) => {
    socket.join(room);

    //Store user
    onlineUsers.push({
      socketId: socket.id,
      username,
      avatar,
      room,
    });

    // Remove duplicates
    onlineUsers = onlineUsers.filter(
      (user, index, self) =>
        index === self.findIndex((u) => u.socketId === user.socketId),
    );

    // Send online users in room
    const roomUsers = onlineUsers.filter((user) => user.room === room);

    io.to(room).emit("online_users", roomUsers);

    console.log("ONLINE USERS:", roomUsers);

     socket.emit("room_list", rooms);
  });

  //Typing indicator
  socket.on("typing", ({ room, username }) => {
    socket.to(room).emit("user_typing", username);
  });

  //Stop typing indicator
  socket.on("stop_typing", ({ room }) => {
    socket.to(room).emit("user_typing", "");
  });

  //Send message
  socket.on("send_msg", async (data) => {
    try {
      const { room, username, text, image, time, avatar } = data;

      // Save to MongoDB
      const newMessage = await Message.create({
        room,
        username,
        avatar,
        text,
        image,
        time,
      });

      // Send to room
      io.to(room).emit("receive_msg", newMessage);
    } catch (err) {
      console.error(err);
    }
  });

  //Delete message
  socket.on("delete_msg", async ({ messageId, room }) => {
    try {
      await Message.findByIdAndDelete(messageId);
      io.to(room).emit("delete_msg", messageId);
    } catch (err) {
      console.error(err);
    }
  });

  //Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    const disconnectedUser = onlineUsers.find(
      (user) => user.socketId === socket.id,
    );

    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    if (disconnectedUser) {
      const roomUsers = onlineUsers.filter(
        (user) => user.room === disconnectedUser.room,
      );

      io.to(disconnectedUser.room).emit("online_users", roomUsers);
    }
  });

});

//Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

