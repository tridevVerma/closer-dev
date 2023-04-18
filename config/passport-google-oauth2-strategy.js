const env = require('../config/environment');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth2').Strategy;
const crypto = require('crypto');
const User = require('../models/User');

// tell passport to use new strategy by google-auth20
passport.use(new googleStrategy({
        clientID: env.google_client_ID,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_callback_URL,
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