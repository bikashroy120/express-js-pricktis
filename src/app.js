const express = require("express")
const morgan = require("morgan")
const createError = require('http-errors')
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')

const app = express()
const userRoute = require("./router/userRouter")
const categoryRouter = require("./router/categoryRouter")

const createAccountLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 5,
	message:'Too many accounts created from this IP, please try again after an minit',
})
 
app.use(cookieParser())
app.use(xssClean())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))





app.get("/api/user",createAccountLimiter,(req,res)=>{
    res.status(200).json({
        message:"hello World"
    })
})

app.use("/api/user",userRoute)
app.use("/api/category",categoryRouter)


// client error handeler

app.use((req,res,next)=>{
    next(createError(404,"route not found"))
})

// server error handeler

app.use((err,req,res,next)=>{
    res.status(err.status || 500).json({
        success:false,
        message:err.message,
    })
})



module.exports = app;