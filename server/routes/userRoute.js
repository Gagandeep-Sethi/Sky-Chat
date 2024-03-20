const express=require("express")
const { signup, login,search } = require("../controllers/userController")
const router=express.Router()

router.post('/user/login',login)
router.post('/user/signup',signup)
router.get('/user?search=gagan',search)
module.exports=router