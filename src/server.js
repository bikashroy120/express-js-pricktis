const app = require("./app")
const dbConnect = require("./config/db")
const { serverPort } = require("./secret")

app.listen(serverPort, ()=>{
    console.log(`server is running at port at http://localhost:${serverPort}`)
     dbConnect()
})