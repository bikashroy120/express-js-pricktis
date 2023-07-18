const fs = require('fs').promises


const deleteImage = async(ImagePath)=>{
    try {
        await fs.access(ImagePath);
        await fs.unlink(ImagePath)
        console.log("Image was deleted")
    } catch (error) {
        console.log("Image dose not exist")
    }
}

module.exports= deleteImage