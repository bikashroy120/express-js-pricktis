const express = require("express")
const { creactCategory, getAllCategory, getSingalCategory, updateCategory } = require("../contoraler/categoryController")
const { isLoggedIn, isAdmin } = require("../middlewaews/auth")

const router = express.Router()

router.post("/creact",isLoggedIn,isAdmin,creactCategory)
router.get("/",getAllCategory)
router.get("/:slug",getSingalCategory)
router.get("/update/:slug",updateCategory)


module.exports = router