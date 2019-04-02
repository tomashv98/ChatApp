const socket = io()

//Elements
const $messageForm = document.querySelector("#message-form")
const $sendLocation = document.querySelector("#send-location")
const $messageFormInput = document.querySelector("input")
const $messageFormBut = document.querySelector("#message-button")
const $messages = document.querySelector("#messages")

// Templates
const messageTemplate = document.querySelector("#message-temp").innerHTML
const locationTemplate = document.querySelector("#location-temp").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-temp").innerHTML

// Options

// location.search returns query string
// "?username=abc&room=123"
// and convert into object {?username, room}
// ignoreQueryPrefix removes ?
const {
  username,
  room
} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

const autoscroll = () => {
  const element = $messages.lastElementChild
  element.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest"
  })
}
// On send message
$messageForm.addEventListener("submit", (e) => {
  e.preventDefault()

  $messageFormBut.setAttribute("disabled", "disabled")

  const message = e.target.elements.message.value

  socket.emit("newMessage", message, (err) => {
    $messageFormBut.removeAttribute("disabled")
    $messageFormInput.value = ""
    $messageFormInput.focus()

    if (err) {
      return console.log(err)
    }
  })
})

// Listen for "message"event, loggin whatever inserted as 2nd arguement. 
socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    username: message.username,
    createdAt: moment(message.createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html)
  autoscroll()
})

//Send location
$sendLocation.addEventListener("click", (e) => {
  e.preventDefault();
  $sendLocation.setAttribute("disabled", "disabled")
  navigator.geolocation.getCurrentPosition((pos) => {
    $sendLocation.removeAttribute("disabled")

    socket.emit("sendLocation", {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    }, (err) => {
      if (err) {
        return console.log(err)
      }
      $sendLocation.removeAttribute("disabled")

      console.log("Location sent")
    })
  })
})

socket.on("locationMessage", (url) => {
  const html = Mustache.render(locationTemplate, {
    url: url.url,
    username: url.username,
    createdAt: moment(url.createdAt).format("h:mm a")
  });
  $messages.insertAdjacentHTML("beforeend", html)
  autoscroll()

})

socket.on("roomData", ({
  room,
  users
}) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  document.querySelector("#sidebar").innerHTML = html
})


socket.emit("join", {
  username,
  room
}, (error) => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})

/*
// socket.on("event", function(){})
socket.on("countUpdated", (count) => {
  console.log("Count updated", count)
})
*/