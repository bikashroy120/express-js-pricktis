const  mongoose  = require("mongoose")
const { dbUrl } = require("../secret")


const dbConnect = ()=>{
    try {
        mongoose.set('strictQuery', true)
        mongoose.connect(process.env.MONGODB__ATLAS)
        console.log("Database connect")

        mongoose.connection.on("error",(error)=>{
            console.log("db connection error",error)
        })

    } catch (error) {
        console.log("Database error") 
    }
}

module.exports = dbConnect