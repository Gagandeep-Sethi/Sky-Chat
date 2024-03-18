const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User=require('../models/User')
const jwt=require('jsonwebtoken')
const bcrypt =require("bcrypt")

const createToken=(_id)=>{
    return jwt.sign({_id},process.env.JWT_SECRET,{expiresIn:'3d'})
    }

passport.use(new GoogleStrategy({
    
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
  },
  async(accessToken, refreshToken, profile, done) => {           //accessToken is provided by google to alter user info read mail n all and refreshToken is to refresh  accessToken as it expires after certain mount of time 
    const {displayName,id}=profile
    
try {
    if (!id) {
        throw new Error("Google ID is required for Google OAuth signup");
      }
    const Id=await User.findOne({googleId:id})
    if(Id){

        const token =createToken(Id._id)
        return done(null,{user:Id,token})
}

const password = Math.random().toString(36).slice(-8)
const salt=await bcrypt.genSalt(10)
const hashPassword=await bcrypt.hash(password,salt)
const user=await User.create({
    username:displayName,
    email:profile.emails[0].value,
    password:hashPassword,
    googleId:id
})



const token =createToken(user._id)

return done(null ,{email:profile.emails[0].value,username:displayName,token})
} catch (error) {
  console.log("error")
    return done(error)
}
  }
));



module.exports = passport;
