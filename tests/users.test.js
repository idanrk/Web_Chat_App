const { addUser, removeUser, getUser, getUsersInRoom, getRooms, users } = require('../utils/users')


beforeEach(() => {
    users.splice(0, users.length) // clear the users array.
        // add few dummy data
    addUser({ id: 7, username: 'testing', room: 'test' })
    addUser({ id: 8, username: 'testin', room: 'test' })
    addUser({ id: 9, username: 'testi', room: 'test' })
    addUser({ id: 10, username: 'testi', room: 'testi' })
})
test('Should add user to users list', () => {
    const user = addUser({ id: 4, username: 'test', room: 'test' })
    expect(user).not.toBeNull()
})
test('Should not add empty user', () => {
    const user = addUser({ id: 4, room: 'test' })
    expect(user).toEqual({ error: "Username and room must be provided!" })
})
test('Should not add user with empty room', () => {
    const user = addUser({ id: 4, username: 'test' })
    expect(user).toEqual({ error: "Username and room must be provided!" })
})
test('Should not add existing username', () => {
    const user1 = addUser({ id: 4, username: 'test', room: 'test' })
    const user2 = addUser({ id: 5, username: 'test', room: 'test' })
    expect(user2).toEqual({ error: `The username "test" already exists in the room. Try another one.` })
})

// Remove user tests
test('Should remove user by id', () => {
    const user = removeUser(7)
    expect(user).toEqual({ id: 7, username: 'testing', room: 'test' })
})
test('Should not remove non existing user', () => {
    const user = removeUser(999)
    expect(user).toEqual(undefined)
})

// Get user tests
test('Should get user by id', () => {
    const user = getUser(7)
    expect(user).toEqual({ id: 7, username: 'testing', room: 'test' })
})
test('Should not get non existing user', () => {
    const user = getUser(999)
    expect(user).toEqual({ error: "User not exists" })
})

// Get user in room tests

test('Should 3 users from "test" room', () => {
    const usersInRoom = getUsersInRoom("test")
    expect(usersInRoom.length).toBe(3)
})
test('Should 0 users from empty room', () => {
    const usersInRoom = getUsersInRoom("null")
    expect(usersInRoom.length).toBe(0)
})

// Get rooms list

test('Should get rooms list', () => {
    const rooms = getRooms()
    expect(rooms).not.toEqual({})
})