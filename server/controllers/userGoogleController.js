const User=require('../models/user')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
exports.gSignup=async(req,res)=>{
const {name,email}=req.body
try {
    const emailExist=await User.findOne({email})
if(emailExist){
    throw new Error ("Email already exists")
}
const password = Math.random().toString(36).slice(-8)
const salt=await bcrypt.genSalt(10)
const hashPassword=await bcrypt.hash(password,salt)
const user=await User.create({
    username:name,
    email:email.toLowerCase(),
    password:hashPassword
})
res.status(200).json({user})
} catch (error) {
    if(error instanceof Error){
        res.status(400).json({message:error.message})
    }else{
        res.status(500).json({message:"server error"})
    }
    
}

}

exports.gLogin=async(req,res)=>{

}