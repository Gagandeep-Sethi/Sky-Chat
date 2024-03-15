const { default: isEmail } = require("validator/lib/isEmail")
const User = require("../models/user")
const { isStrongPassword } = require("validator")
const bcrypt =require("bcrypt")
const validator=require('validator')





exports.login=async(req,res)=>{
    
}

exports.signup=async(req,res)=>{
    const {username,email,password}=req.body
    try {
        if(!username || !password|| !email){
            throw new Error("All Fields must be filled")
        }
        
        if(!validator.isEmail(email)){
            throw new Error("Email not valid")
        }
        if(!validator.isStrongPassword(password)){
            throw new Error("Not a stong password")
        }
        const emailExists=await User.findOne({email})
        if(emailExists){
            throw new Error("Email already exists")
        }
        const salt=await bcrypt.genSalt(10)
        const hashPassword=await bcrypt.hash(password,salt)
        const user=await User.create({
            username,
            email:email.toLowerCase(),
            password:hashPassword
        })
        res.status(200).json({user})
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({mesage:error.message})
        }else{
            res.status(500).json({message:"server error"})
        }
        
    }
}