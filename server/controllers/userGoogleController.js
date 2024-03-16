const User=require('../models/user')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')

const createToken=(_id)=>{
return jwt.sign({_id},process.env.JWT_SECRET,{expiresIn:"3d"})
}

exports.gSignup=async(req,res)=>{
const {name,email,googleId}=req.body
try {
    if (!googleId) {
        throw new Error("Google ID is required for Google OAuth signup");
      }
    const Id=await User.findOne({googleId})
    if(Id){
    throw new Error ("Email already exists")
}

const password = Math.random().toString(36).slice(-8)
const salt=await bcrypt.genSalt(10)
const hashPassword=await bcrypt.hash(password,salt)
const user=await User.create({
    username:name,
    email:email.toLowerCase(),
    password:hashPassword,
    googleId
})

const token =createToken(user._id)
res.status(200).json({email,name,token})
} catch (error) {
    if(error instanceof Error){
        res.status(400).json({message:error.message})
    }else{
        res.status(500).json({message:"server error"})
    }
    
}

}

exports.gLogin=async(req,res)=>{
    const {name,email,googleId}=req.body
    try {
        if(!googleId){
            throw new Error("Google id required")
        }
        const user=await User.findOne({googleId})
        if(!user){
            throw new Error ("Email doesn't exists signup")
        }
        const token = createToken(user._id)
        res.status(200).json({username:name,email,token})
    } catch (error) {
        if(error instanceof Error){
            res.status(400).json({message:error.message})
        }else{
            res.status(500).json({message:"server error"})
        }
    }

}