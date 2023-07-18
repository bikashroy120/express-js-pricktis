const jwt = require('jsonwebtoken')
const { accesskey } = require("../secret")
const createError = require('http-errors')

const isLoggedIn = async(req,res,next)=>{
    try {
        const token = req.cookies.accessToken;
        if(!token){
            throw createError(401,"token not found,please login ")
        }

        const decode = jwt.verify(token,accesskey)
        if(!decode){
            throw createError(401,"inviled token,please login")
        }

        req.user = decode.user
        next()
    } catch (error) {
        next(createError(error))
    }
}


const isAdmin = async(req,res,next)=>{
    try {
       const user =  req.user;

       if(!user.isAdmin){
            throw createError(403," you are not a admin")
       }
       next()
    } catch (error) {
        next(createError(error))
    }
}


module.exports = {isLoggedIn,isAdmin}