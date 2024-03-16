const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {           //accessToken is provided b google to alter user info read mail n all and refreshToken is to refresh  accessToken as it expires after certain mount of time 
    console.log(profile)
    
    
  }
));



module.exports = passport;
