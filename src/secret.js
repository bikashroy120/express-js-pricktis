require('dotenv').config()

const serverPort = process.env.PORT || 5002
const dbUrl = process.env.MONGODB__ATLAS
const jwtKey = process.env.JWT_SECRIT_KEY || "sdsdsd"
const accesskey = process.env.JWT_ACCESS_KEY || "bikash"
const recet = process.env.JWT_RECET_KEY || "recet"

module.exports = {
    serverPort,
    dbUrl,
    jwtKey,
    accesskey,
    recet,
}