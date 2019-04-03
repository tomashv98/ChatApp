const socket = io();

socket.on("getRoomList", (rooms) => {
  if (rooms && rooms.length > 0) {
    const select = document.querySelector("#roomlist")
    rooms.forEach(room => {
      const html = `<option>${room}</option>`
      select.insertAdjacentHTML("beforeend", html)
    });
  }

})