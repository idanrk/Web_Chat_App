const defaultSystemUser = 'Admin'
exports.generateMessage = (text, username = defaultSystemUser) => {
    return {
        text,
        createdAt: new Date().getTime(),
        username
    }
}
exports.generateLocation = (location, username = defaultSystemUser) => {
    return {
        url: `https://www.google.com/maps/search/${location.lat},+${location.long}`,
        createdAt: new Date().getTime(),
        username
    }
}