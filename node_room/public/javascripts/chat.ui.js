function divSystemContentElement(message) {
  return $("<div><div/>").html(`<i>${message}</i>`)
}

function divEscapeContentElement(message) {
  return $("<div><div/>").text(message)
}

var socket = io.connect()
$(document).ready(function() {
  var chatApp = new Chat(socket)
  socket.on('joinResult', (result) => {
    $('#room').text(result.room)
    $('#message').append(
      divSystemContentElement("Room changed")
    )
  })
  socket.on("message",res => {
    console.log(res);
    var newElement =
     $("<div><div/>").text(res.text)
     $("#message").append(newElement)
  })

  socket.on("nameResult",res => {
    var message
    if (res.success) {
      message = "your are now know as" + res.name + '.'
    } else {
      message = res.message
    }
    var newElement =
     $("<div><div/>").text(message)
     $("#message").append(newElement)
  })

  $('#send-form').submit(() => {
    processUserInput(chatApp, socket)
    return false
  })
})

function processUserInput(chatApp, socket) {
  var message = $.trim($("#send-message").val())
  var systemMessage
  if (message.charAt(0) == '/') {
    //command
    systemMessage = chatApp.processCommand(message)
    console.log(message);
  } else {
    chatApp.sendMessage($('#room').text(), message)
    $("#message").append(
      divEscapeContentElement(message)
    )
    $('#message').scrollTop($('#message').prop('scrollHeight'))
  }
  $("#send-message").val('')
}
