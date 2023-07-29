const mongoose = require("mongoose")


const categoryScema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is requerd"]
    },
    slug:{
        type:String,
        required:[true,"Slug is requerd"],
        unique:true,
        lowercase:true
    }
},{timestamps:true})


const Category = mongoose.model("Category",categoryScema)

module.exports = Category
