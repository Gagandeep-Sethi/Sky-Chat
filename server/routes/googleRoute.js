// googleRoute.js
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Google login route
router.get('/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google signup
router.get('/signup',
  passport.authenticate('google',             //google here specifies that this passport will redirect it to the google auth page
  {scope:['profile','email']})                                //this scope indicate what to retrieve 
//   (req, res) => {
//     // Handle successful Google authentication
//     res.redirect('/'); // Redirect to home page or dashboard
//   }
);

router.get('/callback',passport.authenticate('google'),(req,res)=>{
console.log('you reached callback route')
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
