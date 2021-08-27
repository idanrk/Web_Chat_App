const socket = io()

// Elements
const $liveRoomsDiv = document.querySelector('#liveRooms')
const $noRoomsDiv = $liveRoomsDiv.querySelector('#noLive')
const $currentLiveDiv = $liveRoomsDiv.querySelector('#currentLive')
const $roomInput = document.querySelector('#room')

// Templates
const liveRoomsTemplate = document.querySelector("#live-rooms-template").innerHTML


// Sockets listeners

socket.emit('indexRooms', (liveRooms) => {
    if (liveRooms.rooms.length === 0) {
        $currentLiveDiv.style.display = "none"
        $noRoomsDiv.style.display = "block"
    } else {
        $currentLiveDiv.style.display = "block"
        $noRoomsDiv.style.display = "none"
        const html = Mustache.render(liveRoomsTemplate, {...liveRooms })
        document.querySelector("#currentLive").innerHTML = html
    }
})

function select() {
    if ($currentLiveDiv.style.display == "block") {
        const $roomSelect = document.querySelector('#roomsSelect')
        $roomInput.value = $roomSelect.options[$roomSelect.options.selectedIndex].value
    }
}