const slugify = require('slugify')
const Category = require("../modal/categoryModal.js")
const createError = require('http-errors')

const creactCategory = async(req,res,next)=>{

    try {
        const {name} = req.body
        const data = {
            name,
            slug:slugify(name)
        }

        const category = await Category.create(data)

        res.status(200).json({
            success:true,
            message:"creact a category",
            category
            })
    } catch (error) {
        next(createError(404,error)) 
    }
}


const getAllCategory = async(req,res,next)=>{
    try {

        const category = await Category.find().select("name slug").lean()

        if(!category){
            throw createError(404,"category Not found")
        }

        res.status(200).json({
            success:true,
            message:"get all category",
            category
            })
    } catch (error) {
        next(createError(404,error)) 
    }
}


const getSingalCategory = async(req,res,next)=>{
    try {

        const {slug} = req.params;

        const category = await Category.findOne({slug}).select("name slug").lean()
        if(!category){
            throw createError(404,"category Not found")
        }

        res.status(200).json({
            success:true,
            message:"get singal category",
            category
            })
    } catch (error) {
        next(createError(404,error)) 
    }
}



const updateCategory = async(req,res,next)=>{
    try {
        const {slug} = req.params;
        
        const category = await Category.findOne({slug})

        if(!category){
            throw createError(404,"Category Not found this slug")
        }

        const updata = await Category.findOneAndUpdate({slug},{
            name:req.body.name,
            slug:slugify(req.body.name)
        },{new:true}).select("name slug").lean()

        res.status(200).json({
            success:true,
            message:"get singal category",
            category:updata
            }) 
    } catch (error) {
        next(createError(404,error)) 
    }
}


module.exports = {
    creactCategory,
    getAllCategory,
    getSingalCategory,
    updateCategory
}