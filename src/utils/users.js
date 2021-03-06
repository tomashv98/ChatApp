const users = [];

const addUser = ({
  id,
  username,
  room
}) => {
  if (!username || !room) {
    return {
      error: "Username and room are required"
    }
  }
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase()


  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  })

  if (existingUser) {
    return {
      error: "Username is already in use"
    }
  }

  const user = {
    id,
    username,
    room
  }
  users.push(user)
  return {
    user
  }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)
  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = (id) => {
  const user = users.find((user) => user.id === id)
  if (!user) {
    return {
      error: "User not found"
    }
  }
  return user
}

const getUsersInRoom = (room) => {
  if (!room) {
    return alert("Please fill in room name")
  }
  room = room.trim().toLowerCase()
  return users.filter((user) => user.room === room)
}

const getRoomList = () => {
  const uniqueRooms = [...new Set(users.map(user => user.room))]
  return uniqueRooms
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getRoomList
}