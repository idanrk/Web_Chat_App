users = []

// Users represented as {id,username,room}

// Add User
const addUser = ({ id, username, room }) => {
        if (!username || !room)
            return { error: "Username and room must be provided!" }

        // Clean the data
        username = username.trim().toLowerCase()
        room = room.trim().toLowerCase()

        // Check if user already exists in the room.
        const existUser = users.find((user) => { return user.username === username && user.room === room })
        if (existUser)
            return { error: `The username "${username}" already exists in the room. Try another one.` }

        const user = { id, username, room }
        users.push(user)
        return { user }

    }
    // Remove User
const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1)
        return users.splice(index, 1)[0]
}

// Get User

const getUser = id => {
    const user = users.find(user => user.id === id)
    if (user)
        return user
    else
        return { error: "User not exists" }
}

const getUsersInRoom = room => {
    const roomUsers = users.filter(user => user.room === room)
    return roomUsers
}

const getRooms = () => {
    const rooms_counter = {}
    users.forEach(user => {
        if (!rooms_counter[user.room])
            rooms_counter[user.room] = 1
        else
            rooms_counter[user.room] += 1
    })
    const rooms = []
    for (const [key, value] of Object.entries(rooms_counter)) {
        rooms.push({ room: key, people: value })
    }
    return { rooms }
}
module.exports = { addUser, removeUser, getUser, getUsersInRoom, getRooms, users }