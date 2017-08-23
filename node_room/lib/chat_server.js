const socketio = require('socket.io')
var nickNames = {},
    currentRoom = {},
    namesUsed = [],
    guestNumber = 1

exports.listen = function (server) {
  var io = socketio.listen(server)
  io.sockets.on("connection", socket => {
    //推 emit
    //拉 ajax + setIntervel
    console.log(socket)
    guestNumber = assignGuestName(
      socket,guestNumber,nickNames,namesUsed)
    joinRoom(socket,"lobby")
    handleMessageBroadcasting(socket)
    handleNameChangeAttempts(socket,nickNames,namesUsed)
    handleClientDisconnection(socket)
  })
}

function handleClientDisconnection (socket) {
  socket.on("disconnect", () => {
    var nameIndex = namesUsed.indexOf(
      nickNames[socket.id]
    )
    delete namesUsed[nameIndex]
    delete nickNames[socket.id]
  })
}

function handleMessageBroadcasting(socket) {
  socket.on("message" , message => {
    socket.broadcast.to(message.room).emit(
      "message",{
        text:nickNames[socket.id] + ":" + message.text
      }
    )
  })
}

function handleNameChangeAttempts(socket,nickNames,namesUsed) {
  socket.on('nameAttempt', (name) => {
    if (namesUsed.indexOf(name) === -1) {
      socket.emit("nameResult", {
        success: true,
        name
      })
      var previousName = nickNames[socket.id]
      var previousNameIndex = namesUsed.indexOf(previousName)
      namesUsed.push(name)
      nickNames[socket.id] = name
      delete namesUsed[previousNameIndex]
      socket.broadcast.to(currentRoom[socket.id]).emit("message", {
        text: previousName + "is now know as " + name + "."
      })
    } else {
      socket.emit("nameResult", {
        success: false,
        message: "That name is already in use."
      })
    }
  })
}

function assignGuestName(socket,guestNumber,nickNames,namesUsed) {
  var name = "guest" + guestNumber
  console.log(socket.id);
  nickNames[socket.id] = name
  namesUsed.push(name)
  socket.emit('nameResult',{
    success: true,
    name
  })
  return guestNumber + 1
}

function joinRoom(socket,room) {
  //加入 一个 频道
  socket.join(room)
  currentRoom[socket.id] = room
  socket.emit("joinResult",{room})
  socket.broadcast.to(room).emit('message',{
    text: nickNames[socket.id] + "来了" + room + "."
  })
}
