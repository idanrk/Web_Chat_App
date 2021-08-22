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
        const existUser = users.find((user) => user.username === username && user.room === room)
        if (existUser)
            return { error: `The username "${username}" already exists in the room. Try another one.` }

        const user = { id, username, room }
        users.push(user)
        return user

    }
    // Remove User
const removeUser = (id) => {
    const index = users.findIndex(user => user.id === id)
    if (index !== -1)
        return users.splice(index, 1)[0]
}
addUser({
    id: 1,
    username: "ida",
    room: "id"
})
console.log(users)
addUser({
    id: 2,
    username: "iDa",
    room: "id"
})
addUser({
    id: 1,
    username: "",
    room: ""
})
removeUser(1)
console.log(users)