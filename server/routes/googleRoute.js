// googleRoute.js
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Google login route
router.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));



router.get('/callback',passport.authenticate('google', { failureRedirect: '/auth/google/login',session: false }),(req,res)=>{

  const {username,email,token}=req.user.user

  res.status(200).json({email,username,token})
  // res.redirect(`http://localhost:3000/login?token=${req.user}`);
})

module.exports = router;


















// router.get('/signup',
//   passport.authenticate('google', { session: false }),         //google here specifies that this passport will redirect it to the google auth page
//   (req, res) => {
//     // Handle successful Google authentication
//     res.redirect('/'); // Redirect to home page or dashboard
//   }
// );

// module.exports = router;
