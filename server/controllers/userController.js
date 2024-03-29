const User = require('../models/User')
const jwt=require('jsonwebtoken')
const bcrypt =require("bcrypt")
const validator=require('validator')

const createToken=(_id)=>{
return jwt.sign({_id},process.env.JWT_SECRET,{expiresIn:'3d'})
}



exports.login=async(req,res)=>{
    const {email,password}=req.body
    try {
        if(!email || !password){
            throw new Error("All fields must be field")
        }
        const user=await User.findOne({email})
        if(!user){
            throw new Error ("Email not found")
        }
        const passwordCheck=await bcrypt.compare(password,user.password)
        if(!passwordCheck){
            throw new Error ("Password wrong")
        }
        const token=createToken(user._id)
        res.status(200).json({email,username:user.username,token})
        
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({message:error.message})
        }
        else{
            res.status(500).json({message:"server error"})
        }
        
    }
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
        const token=createToken(user._id)
        res.status(200).json({email,username:user.username,token})
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({mesage:error.message})
        }else{
            res.status(500).json({message:"server error"})
        }
        
    }
}
//searching all user execpt the requestion user
exports.search=async(req,res)=>{
    const keyword=req.query.search?{
        $or:[
            {
              username:{$regex:req.query.search ,$option:'i'}
            },
            {
              email:{$regex:req.query.search ,$option:'i'}
            }
        ]
    }:{}
    const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
}