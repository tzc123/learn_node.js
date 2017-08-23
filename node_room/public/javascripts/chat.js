class Chat {
  constructor(socket) {
    this.socket = socket
  }

  sendMessage(room,text) {
    var message = {room,text}
    this.socket.emit("message", message)
  }

  processCommand(command) {
    var words = command.split(" ")
    var command = words[0].substring(1,words[0].length)
                          .toLowerCase()
    var message = false
    switch (command) {
      case 'join':
        break;
      case "nick":
        words.shift()
        var name = words.join(" ")
        this.socket.emit("nameAttempt", name)
        console.log(name);
        break;
      default:
        message = "Unrecognized command"
        break;
    }
  }
}
