
const mongoose = require("mongoose")
const createError = require('http-errors')

const FindItem = async(id,modal,option)=>{
    try {
        const item = await modal.findById(id,option={})
        if(!item) throw createError(404,"item Not Found")
        return item
    } catch (error) {
        if(error instanceof mongoose.Error){
           throw createError(400,"envilied user Id")
        }
        throw error
    }
}

module.exports = {FindItem}