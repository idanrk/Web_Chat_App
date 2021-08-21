const socket = io()

// Elements
const $messageForm = document.querySelector('#formdata')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationBtn = document.querySelector("#location")
const $message = document.querySelector("#message")

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationTemplate = document.querySelector("#location-template").innerHTML

socket.on("message", message => {
    console.log(message)
    const html = Mustache.render(messageTemplate, { message })
    $message.insertAdjacentHTML('beforeend', html)
})
socket.on('locationMessage', url => {
    console.log(url)
    const html = Mustache.render(locationTemplate, { url })
    $message.insertAdjacentHTML('beforeend', html)
})
$messageForm.addEventListener('submit', (e) => {
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
$locationBtn.addEventListener('click', () => {

    $locationBtn.setAttribute('disabled', true) // wait till location is acknowledged
    if (!navigator.geolocation)
        alert("Your browser not supporting geolocation. Try use another.")

    navigator.geolocation.getCurrentPosition(location => {
        socket.emit("sendLocation", { long: location.coords.longitude, lat: location.coords.latitude }, () => {
            $locationBtn.removeAttribute('disabled')
            console.log("Location Shared!")
        })
    })
})