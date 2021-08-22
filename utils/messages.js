exports.generateMessage = (text, username) => {
    return {
        text,
        createdAt: new Date().getTime(),
        username
    }
}
exports.generateLocation = (location, username) => {
    return {
        url: `https://www.google.com/maps/search/${location.lat},+${location.long}`,
        createdAt: new Date().getTime(),
        username
    }
}