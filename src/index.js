const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocation } = require('../utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const filter = new Filter()

io.on("connection", (socket) => {
    socket.on('join', ({ username, room }) => {
        socket.join(room)
        socket.emit('message', generateMessage(`Welcome to ${room} room`))
        socket.broadcast.to(room).emit("message", generateMessage(`${username} has joined the room!`))


        socket.on('sendMessage', (message, callback) => {
            if (filter.isProfane(message))
                return callback("Try to be nice")
            io.to(room).emit('message', generateMessage(message, username))
            callback()
        })
        socket.on("disconnect", () => {
            io.to(room).emit('message', generateMessage("A user has left the chat"))
        })
        socket.on("sendLocation", (location, callback) => {
            io.to(room).emit("locationMessage", generateLocation(location, username))
            callback()
        })

    })

})

const port = process.env.PORT || 3000
const viewsPath = path.join(__dirname, '../public')

app.use(express.static(viewsPath))

server.listen(port, () => { console.log("Listening on: " + port) })