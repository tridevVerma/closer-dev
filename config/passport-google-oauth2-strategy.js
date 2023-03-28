const passport = require('passport');
const googleStrategy = require('passport-google-oauth2').Strategy;
const crypto = require('crypto');
const User = require('../models/User');

// tell passport to use new strategy by google-auth20
passport.use(new googleStrategy({
        clientID:     "598425896524-6c2gmoak5086q3dlvh8dp20pk8i9ek0b.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback",
        passReqToCallback   : true
    },
    async function(request, accessToken, refreshToken, profile, done) {

        try {

            // find a user
            const user = await User.findOne({ email: profile.emails[0].value });
            
            if(user){
                // if the user found set the user as req.user
                return done(null, user);
            }
            else{
                // if not found, create a user and set req.user
                await User.create({
                    name : profile.displayName,
                    email : profile.emails[0].value,
                    password : crypto.randomBytes(20).toString('hex')
                });
                return done(null, user);
            }
          
        } catch (err) {
            if(err){ console.log("Error in google-strategy-passport", err); return; }
        }

        
    }

))

module.exports = passport;