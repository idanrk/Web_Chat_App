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
    socket.emit('message', generateMessage("Hello"))
    socket.broadcast.emit("message", generateMessage("A new user has joined."))
    socket.on('sendMessage', (message, callback) => {
        if (filter.isProfane(message))
            return callback("Try to be nice")
        io.emit('message', generateMessage(message))
        callback()
    })
    socket.on("disconnect", () => {
        io.emit('message', generateMessage("A user has left the chat"))
    })
    socket.on("sendLocation", (location, callback) => {
        io.emit("locationMessage", generateLocation(location))
        callback()
    })
})

const port = process.env.PORT || 3000
const viewsPath = path.join(__dirname, '../public')

app.use(express.static(viewsPath))

server.listen(port, () => { console.log("Listening on: " + port) })