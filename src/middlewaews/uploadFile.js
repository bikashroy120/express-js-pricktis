
const multer  = require('multer')


const filePath = process.env.USER_IMAGE_PATH || "publjic/images/users/" 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images/users/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload