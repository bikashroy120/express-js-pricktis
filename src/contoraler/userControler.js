

const mongoose = require("mongoose")
const User = require("../modal/userModale")
const createError = require('http-errors')
const { FindItem } = require("../services/findByIdServices")
const deleteImage = require("../helper/deleteImage")
const { creactjwtToken } = require("../helper/jwtToken")
const { jwtKey, accesskey } = require("../secret")
const emailWithNodemailler = require("../helper/email")
const jwt = require('jsonwebtoken')
const fs = require("fs")
const bcrypt = require("bcrypt")

const regester = async(req,res,next)=>{

    try {
        const {name,email,password,phone,addres} = req.body;

        const existUser = await User.exists({email:email})

        if(existUser){
             throw createError(409,"user with this email already exits. Please sign up")
        }

        const newUser = {
            name,
            email,
            password,
            phone,
            addres,
        }


        const token = creactjwtToken(newUser,jwtKey,"10m")

        const emailData = {
            email,
            subject:"Acount Activition Email",
            html:`
                <h2> hello ${name} !</h2>
                <p>Plases Click here to <a href="${process.env.CLIENT_URL}/api/users/activate/${token}" target="_blank">activate your  acount </a></p>
            `
        }

        try {
            await emailWithNodemailler(emailData)
        } catch (error) {
            next(createError(404,"email not send"))
            return
        }

        // const creactUser = await User.create(req.body)
        res.status(201).json({
            success:true,
            message: `sent email on your email address chicked it`,
            token:token
        })
    } catch (error) {
        // res.status(404).json(error)
        next(createError(404,error))
    }

}


const varfyEmailInRegester = async(req,res,next)=>{
    try {

        const token = req.body.token;
        if(!token) throw createError(404,"token not found")

        try {
           const decode = jwt.verify(token,jwtKey)
           if(!decode) throw createError(404,"unable to verify user")

           const existUser = await User.exists({email:decode.email})

           if(existUser){
                throw createError(409,"user with this email already exits. Please sign up")
           }

            await User.create(decode)
            res.status(201).json({
                success:true,
                message: `user regester success !`,
            })


        } catch (error) {
            next(createError(404,error))   
        }

        
    } catch (error) {
        next(createError(404,error))
    }
}


const updateUser = async(req,res,next)=>{
    const {id} = req.params;
    try {
        const user = await User.findById({_id:id})
        if(!user){
            throw createError(404,"user not found !")
        }

        if(req.file){
            if(user.image){
                const filePath = `public/images/users/${user.image}`
                fs.unlink(filePath, (err)=>{
                    if(err){
                        console.error(err)
                    }
                })
            }
        }

        await User.findByIdAndUpdate(id,{
            name:req.body.name,
            addres:req.body.addres,
            phone:req.body.phone,
            image:req.file.filename,
        },{new:true,runValidators:true,context:"query"})

        res.status(201).json({
            success:true,
            message: `user update success !`,
        })
        
    } catch (error) {
        next(createError(404,error))
    }
}

const getUser = async(req,res,next)=>{
    try {

        const search = req.query.search || "";
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;

        const regSearch = new RegExp('.*' + search + '.*','i')

        const filter = {
            isAdmin:{$ne:true},
            $or:[
                {name:{$regex:regSearch}},
                {email:{$regex:regSearch}},
                {phone:{$regex:regSearch}},
            ]
        }

        const option = {password:0}

        const user = await User.find(filter,option)
        .limit(limit)
        .skip((page-1)*limit)

        const count = await User.find(filter).countDocuments()

        res.status(201).json({
            success:true,
            message:"success",
            user,
            pagenation:{
                totalPages:Math.ceil(count/limit),
                currentPage:page,
                previousPage:page - 1 > 0 ? page-1 :null,
                nextPage:page + 1 <= Math.ceil(count/limit) ? page + 1 :null
            }
        })
    } catch (error) {
        // res.status(404).json(error)
        next(createError(404,error))
    }

}

const getOneUser = async(req,res,next)=>{
    try {
        const id = req.params.id
        const option  = {password:0}
        const user = await FindItem(id,User,option)
        res.status(200).json({
            success:true,
            message:"success",
            user,
        })
    } catch (error) {

        if(error instanceof mongoose.Error){
            next(createError(400,"envilied user Id"))
        }

        next(createError(404,error))
    }
}

const deteleUser = async(req,res,next)=>{
    try {
        const id = req.params.id
        const option  = {password:0}
        const user = await FindItem(id,User,option)
        if(user.image){
            const filePath = `public/images/users/${user.image}`
            fs.unlink(filePath, (err)=>{
                if(err){
                    console.error(err)
                }
            })
        }
        
        await User.findByIdAndDelete(id)
        res.status(200).json({
            success:true,
            message:"user delete success",
        })
    } catch (error) {

        if(error instanceof mongoose.Error){
            next(createError(400,"envilied user Id"))
        }
        next(createError(404,error))
    }
}


const logInUser = async(req,res,next)=>{
    try {
        const {email,password}=req.body

        // email exites
        const user = await User.findOne({email})
        if(!user){
            throw createError(404,"User does not exits with this email,Please regester")
        }

        // compaier password
        const valitPassword = bcrypt.compareSync(password, user.password);
        if(!valitPassword){
            throw createError(404,"Email or password didnot macth !")
        }

        if(user.isBanned){
            throw createError(404,"your are banned,plaece contact authorict")
        }

        const accessToken = creactjwtToken({user:user},accesskey,"10m")

        res.cookie('accessToken',accessToken,{
            maxAge:15*60*1000,
            httpOnly:true,
            sameSite:true,
        })

        res.status(200).json({
            success:true,
            message:"log in success",
            user
        })
    } catch (error) {
        next(createError(404,error)) 
    }
}


const userLogOut = async(req,res,next)=>{
    try {

        res.clearCookie("accessToken")
        
        res.status(200).json({
            success:true,
            message:"log out success",
        })
    } catch (error) {
        next(createError(404,error)) 
    }
}

const BannedUser = async(req,res,next)=>{
    try {
        const id = req.params.id
        const user = await User.findById({_id:id})
        if(!user){
            throw createError(404,"user not found !")
        }

        await User.findByIdAndUpdate({_id:id},{isBanned:true},{new:true,runValidators:true,context:"query"})
        res.status(200).json({
        success:true,
        message:"user banned success",
        })
    } catch (error) {
        next(createError(404,error)) 
    }
}

const unBannedUser = async(req,res,next)=>{
    try {
        const id = req.params.id
        const user = await User.findById({_id:id})
        if(!user){
            throw createError(404,"user not found !")
        }

        await User.findByIdAndUpdate({_id:id},{isBanned:false},{new:true,runValidators:true,context:"query"})
        res.status(200).json({
        success:true,
        message:"user unbanned success",
        })
    } catch (error) {
        next(createError(404,error)) 
    }
}


const changePasssword = async(req,res,next)=>{
    try {
        const userId = req.user._id
        const {oldPassword,newPassword,comfirmpassword}=req.body;

        const user = await User.findById({_id:userId})
        if(!user){
            throw createError(404,"user not found !")
        }
        
        const valitPassword = bcrypt.compareSync(oldPassword, user.password);
        if(!valitPassword){
            throw createError(404,"password didnot macth !")
        }

        if(newPassword !== comfirmpassword){
            throw createError(404,"new pasword and comfiram password not macth")
        }

        await User.findByIdAndUpdate({_id:userId},{password:newPassword},{new:true})

        res.status(200).json({
            success:true,
            message:"update password success",
            })
        
    } catch (error) {
        next(createError(404,error)) 
    }
}


module.exports= {
    regester,
    getUser,
    getOneUser,
    deteleUser,
    varfyEmailInRegester,
    updateUser,
    logInUser,
    userLogOut,
    BannedUser,
    unBannedUser,
    changePasssword
}