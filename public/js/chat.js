const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationBtn = document.querySelector("#location")
const $message = document.querySelector("#message")

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationTemplate = document.querySelector("#location-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {

    // Getting the most recent message
    const $newMessage = $message.lastElementChild

    // Get its height
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible Height
    const visibleHeight = $message.offsetHeight

    //Container height
    const containerHeight = $message.scrollHeight
    const scrollHeight = $message.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollHeight) {
        $message.scrollTop = $message.scrollHeight
    }
}

// Sockets listeners
socket.on("message", message => { // Chat Messages
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('H:mm A'),
        username: message.username
    })
    $message.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', location => { // Location Messages
    const html = Mustache.render(locationTemplate, {
        url: location.url,
        createdAt: moment(location.createdAt).format('H:mm A'),
        username: location.username
    })
    $message.insertAdjacentHTML('beforeend', html)
})

socket.on('roomData', (roomData) => {
    const html = Mustache.render(sidebarTemplate, {...roomData })
    document.querySelector("#sidebar").innerHTML = html
})


// Event Listeners
$messageForm.addEventListener('submit', (e) => { // Send message form
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', true) // Cannot send more messages without server acknowledge
    const msg = e.target.elements.message.value
    socket.emit("sendMessage", msg, (error) => {

        $messageFormButton.removeAttribute('disabled') // Reset message form
        $messageFormInput.value = $messageFormInput.defaultValue
        $messageFormInput.focus()

        if (error)
            return console.log(error)
        console.log("Message delivered!")
    })
})

$locationBtn.addEventListener('click', () => { // Send location

    $locationBtn.setAttribute('disabled', true) // wait till location is acknowledged
    if (!navigator.geolocation)
        alert("Your browser not supporting geolocation. Try use another.")

    navigator.geolocation.getCurrentPosition(location => {
        socket.emit("sendLocation", { long: location.coords.longitude, lat: location.coords.latitude }, () => {
            $locationBtn.removeAttribute('disabled')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
        if (error) {
            alert(error)
            location.href = '/'
        }
    }) //send the server the user's info