const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

// imported methods creates in users.js file
const {
  createUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./users.js");

// allows app to run on port 5000 or a more specific port upon deployment
const PORT = process.env.PORT || 5000;

// requiring router created in router.js
const router = require("./router");

const app = express();
// pass in app that was initialized with express
const server = http.createServer(app);
// io is an instance of socketio and pass in server
const io = socketio(server, {
  cors: {
    origin: "your origin",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// socket.io methods that tracks real-time when users log on and log off
io.on("connection", (socket) => {
  // the .on takes two parameters:
  // this will recieve the specific event that is being emitted
  // call back function will be triggered when event on client side is emmited
  socket.on("join", ({ name, room }, callback) => {
    // the defined function can only return two things: error or user
    // passed into the addUser function are the parameter it can take
    const { error, user } = createUser({ id: socket.id, name, room });

    // error coming from function
    // the return statement will kick us out of function
    if (error) return callback(error);

    // join will add user to room
    // user.room stores the name of the room
    socket.join(user.room);

    // automated event when user joins a room
    // welcome message
    socket.emit("message", {
      user: "admin",
      text: `Hi ${user.name}! Welcome to the ${user.room} room. `,
    });

    // this will send a message to everyone in the room except the user
    socket.broadcast
      // .to specifies which room
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined` });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    // will only run if there is no error in
    // the if statement callback function
    callback();
  });

  // event for user generated messages
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    console.log(1);

    io.to(user.room).emit("message", { user: user.name, text: message });

    // always include so socket.on knows to run on fronend
    callback();
  });

  // event for disconnecting
  socket.on("disconnection", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

// middleware
app.use(router);
app.use(express.json());
app.use(cors());

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
