const mongoose = require("mongoose");
const bcrypt =  require("bcrypt");


const userSecema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is requerd"]
    },
    email:{
        type:String,
        required:[true,"Email is requerd"],
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:[true,"password is requerd"],
        set:(v)=>bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image:{
        type:String
    },
    addres:{
        type:String
    },
    phone:{
        type:String,
        required:[true,"phone is required"]
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    isBanned:{
        type:Boolean,
        default:false
    }
},{timestamps:true})


const User = mongoose.model("Users",userSecema)

module.exports = User;


