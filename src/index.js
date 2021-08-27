const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocation } = require('../utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom, getRooms, users } = require('../utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const filter = new Filter()

io.on("connection", (socket) => {
    socket.on('indexRooms', callback => {
        return callback(getRooms())
    })
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error)
            return callback(error)
        socket.join(user.room)
        socket.emit('message', generateMessage(`Welcome to ${user.room} room`))
        socket.broadcast.to(user.room).emit("message", generateMessage(`${user.username} has joined the room!`))
        io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room) })
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        if (filter.isProfane(message))
            return callback("Try to be nice")
        io.to(user.room).emit('message', generateMessage(message, user.username))
        callback()
    })

    socket.on("sendLocation", (location, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit("locationMessage", generateLocation(location, user.username))
        callback()
    })

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left the chat!`))
            io.to(user.room).emit("roomData", { room: user.room, users: getUsersInRoom(user.room) })
        }
    })
})

const port = process.env.PORT || 3000
const viewsPath = path.join(__dirname, '../public')

app.use(express.static(viewsPath))

server.listen(port, () => { console.log("Listening on: " + port) })