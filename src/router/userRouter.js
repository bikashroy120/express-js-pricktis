const express = require("express")
const { regester, getUser, getOneUser, deteleUser, varfyEmailInRegester, updateUser, logInUser, userLogOut, BannedUser, unBannedUser, changePasssword, forgetPassword } = require("../contoraler/userControler")
const upload = require("../middlewaews/uploadFile")
const { isLoggedIn, isAdmin } = require("../middlewaews/auth")

const router = express.Router()

router.post("/regester",upload.single('image'),regester)
router.post("/regester-verify",varfyEmailInRegester)
router.post("/login",logInUser)
router.post("/logout",userLogOut)
router.post("/forget",forgetPassword)
router.put("/user-update/:id",isLoggedIn,upload.single('image'),updateUser)
router.put("/ban-user/:id",isLoggedIn,isAdmin,BannedUser)
router.put("/unban-user/:id",isLoggedIn,isAdmin,unBannedUser)
router.put("/update-password",isLoggedIn,changePasssword)
router.get("/users",isLoggedIn,isAdmin,getUser)
router.get("/user/:id",isLoggedIn,getOneUser)
router.delete("/user/:id",isLoggedIn,deteleUser)


module.exports = router