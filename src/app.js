const express = require("express");
const http = require("http")
const path = require("path")
const socketio = require("socket.io")
const Filter = require("bad-words")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const {
  generateLocMes,
  generateMes
} = require("./utils/messages")

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getRoomList
} = require("./utils/users")

const port = process.env.PORT || 8080;
const ip = process.env.IP || "localhost";

const publicDir = path.join(__dirname, "../public")

app.use(express.static(publicDir))


// Set up event listener on every connected user
io.on("connection", (socket) => {

  console.log("An user has connected to the app")


  socket.emit('getRoomList', getRoomList());


  socket.on("join", ({
    username,
    room
  }, callback) => {

    removeUser(socket.id);

    const {
      error,
      user
    } = addUser({
      id: socket.id,
      username,
      room
    })
    if (error) {
      return callback(error)
    }
    if (!user.username || !user.room) {
      alert("Room and Username must be filled in")
    }

    socket.join(user.room)

    socket.emit("message", generateMes("ChatApp", `Welcome to chatroom no.${user.room}`))

    socket.broadcast.to(user.room).emit("message", generateMes("ChatApp", `${user.username} has joined the chat`))

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    })


    callback()
  })



  socket.on("newMessage", (message, callback) => {
    const user = getUser(socket.id)

    const filter = new Filter()
    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed")
    }
    io.to(user.room).emit("message", generateMes(user.username, message))

    callback()
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id)

    io.to(user.room).emit("locationMessage", generateLocMes(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))

    callback()
  })

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", generateMes("ChatApp", `${user.username} had left the chat`))
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }

  })

})



server.listen(port, function () {
  console.log("Server has started");
});


/*
// Send something to specific client
socket.emit("countUpdated", count)
// Listen to event
socket.on("incre", () => {
  count++
  // socket.emit("countUpdated", count) to specific connection
  // to all connections
  io.emit("countUpdated", count)
})
*/