const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const filter = new Filter()

io.on("connection", (socket) => {
    socket.emit('message', "Hello")
    socket.broadcast.emit("message", "A new user has joined.")
    socket.on('sendMessage', (msg, callback) => {
        if (filter.isProfane(msg))
            return callback("Try to be nice")
        io.emit('message', msg)
        callback()
    })
    socket.on("disconnect", () => {
        io.emit('message', "A user has left the chat")
    })
    socket.on("sendLocation", (location, callback) => {
        io.emit("locationMessage", `https://www.google.com/maps/search/${location.lat},+${location.long}`)
        callback()
    })
})

const port = process.env.PORT || 3000
const viewsPath = path.join(__dirname, '../public')

app.use(express.static(viewsPath))

server.listen(port, () => { console.log("Listening on: " + port) })