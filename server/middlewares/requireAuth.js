const jwt= require('jsonwebtoken')
const User=require('../models/User')

const requireAuth= async(req,res,next)=>{
   const {authorization}= req.header
   if(!authorization){
    res.status(401).json({error:"Authorization token required"})
   }
   //authorization =>     Bearer gshjdfgjhfgsjfhfigf.dsdyweyhdd.jadsagdajshd    
   const token =authorization.split(' ')[1]     //so we split the first part to get token exactly

   try {
    const {_id}=jwt.verify(token,process.env.JWT_SECRET)     //we verify and extract _id from the token
     req.user= await User.findOne({_id}).select('_id')   //we are attaching user property to req and passing it on to next middleware of main function and we can use that tha user property as we know now the user is authenticated
     next()

   } catch (error) {
    console.log(error)
    res.status(401).json({error:'Request not authorized'})
   }
   

}
module.exports=requireAuth

// to send this header
//const user= useSeelector(...........)  user present in store
// const fetchData=async()=>{
//    const data=await fetch('/api/workout',
//    {
//       headers:{
//          'Authorization': `Bearer ${user.token}`      //assigning auth header with req       
//       }
//    })
// if(data.ok){
//    dispatchEvent(.........)
// }
// }
// ..................