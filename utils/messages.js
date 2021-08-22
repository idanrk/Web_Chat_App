exports.generateMessage = text => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}
exports.generateLocation = location => {
    return {
        url: `https://www.google.com/maps/search/${location.lat},+${location.long}`,
        createdAt: new Date().getTime()
    }
}