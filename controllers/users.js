const env = require('../config/environment');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Token = require('../models/Token');
const crypto = require('crypto');
const resetMailer = require('../mailers/resetMailer');

// view profile to signed user
module.exports.profile = async (req, res) => {
    try {
        // Get the user with id passed by params and populate its freinds (only name)
        const user = await User.findById(req.params.id).populate('freinds', 'name');
        const me = req.user;

        // check if profile viewer (user) is already signed user's (me) freind or not
        let removeFreind = false;

        // If any of user's freinds ids matches to signed user id --> they are freinds, set removeFreind to true
        for(let freind of user.freinds){
            if(freind.id === me.id){
                removeFreind = true;
                break;
            }
        }
        
        res.render('Profile', {
            title : "User's Profile",
            profile_user : user,
            removeFreind
        });
    } catch (err) {
        console.log("Can't find user in DB to view profile", err); return;
    }
}

// update profile of logged user
module.exports.updateProfile = async (req, res) => {

    /** With Multer **/

    if(req.user.id == req.params.id){
        try {
            // Find user from params
            let user = await User.findById(req.params.id);

            // Mongoose static function
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log("****Multer Error****", err);
                    return;
                }

                // set email or name
                user.email = req.body.email;
                user.name = req.body.name;

                // if image file is attached
                if(req.file){
                    // if user already has avatar
                    if(user.avatar){
                        const avatarfilePath = path.join(__dirname, "..", user.avatar);

                        if(fs.existsSync(avatarfilePath)){
                            // delete avatar if already exist
                            fs.unlinkSync(avatarfilePath);
                        }
                    }
                    // this is the path of the uploaded file into the avatar field in the user
                    user.avatar = path.join(User.avatarPath, req.file.filename) ;
                }

                user.save();
                req.flash('success', "Profile Updated!!");
                return res.redirect('back');
            })

        } catch (err) {
            console.log("ERROR", err);
            return;
        }
    }
    else{
        req.flash('error', "Unauthorized Access");
        return res.status(401).redirect('back');
    }
}

// render signup page
module.exports.signup = function(req, res) {
    if(req.isAuthenticated()){
        // If signed in redirect to Home page
        return res.redirect('/');
    }
    return res.render('Signup', {title : "Signup"});
}

// render login page
module.exports.login = function(req, res) {
    if(req.isAuthenticated()){
        // If signed in redirect to Home page
        return res.redirect('/');
    }
    return res.render('Login', {title : "Login"});
}

// get sign up data
module.exports.create = async (req, res) => {
    if(req.body.password !== req.body.confirm_password){
        // password not matched to confirm password
        req.flash('error', "password and confirm password didn't match");
        return res.redirect('back');
    }

    try {
        // Find user with email in DB
        const user = await User.findOne({email: req.body.email});
        if(!user){
            // If user don't exist create it
            await User.create(req.body);
            req.flash('success', 'User created Successfully');
        }
        else{
            // Error => User already exists
            req.flash('error', "User already exists");
        }
        return res.redirect('/users/login');
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }


}

// sign in and create session for the user
module.exports.createSession = (req, res) => {
    console.log("Logged In");
    req.flash('success', "Logged in!!");
    return res.redirect('/');
}

// logout user
module.exports.destroySession = (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err) } 
        console.log("Logged Out");
        req.flash('success', "You have logged out!!");
        res.redirect('/');
    });
}

// render forget password page
module.exports.view_Reset = function(req, res) {
    if(req.isAuthenticated()){
        // If signed in redirect to Home page
        return res.redirect('/');
    }
    return res.render('ResetPwd', {title : "ResetPassword"});
}

// reset password
module.exports.createToken = async function(req, res){
    if(req.isAuthenticated()){
        // If signed in redirect to Home page
        return res.redirect('/');
    }

    try {
        // Find user with email in DB
        const user = await User.findOne({email: req.body.email})
        if(user){
            // If user exists get the token (create if not exist)
            let token = await Token.findOne({userID: user._id});
            if(!token){
                token = await Token.create({
                    userID: user._id,
                    token: crypto.randomBytes(20).toString('hex')
                });
            }
            
            // create reset link that will be sent to email of the user
            const resetLink = `http://${env.domain_name}:${env.server_port}/users/reset-pwd/${user.id}/${token.token}`;
            resetMailer.resetPWD({name: user.name, email: user.email}, resetLink);

            // After sending email render checkMail Page
            return res.render('CheckMail', {
                title: "Check your email"
            });        
        }
        else{
            req.flash('error', "No user found with given email!");
            res.redirect('/users/signup');
        }
        
    } catch (err) {
        console.log("Error in finding user in reset-pwd", err);
        return;
    }
    
}

module.exports.resetPwd = async (req, res) => {
    // Password and Confirm Password didn't matched --> In email
    if(req.body.pwd !== req.body['confirm-pwd']){
        req.flash('error', "Password and Confirm Password didn't matched");
        return res.redirect('/users/reset-pwd');
    }
    else{
        // Find user with email id
        const user = await User.findById(req.params.id);
        if(!user){
            // If user don't exist --> redirect to Home
            req.flash('error', "Invalid link or expired");
            return res.redirect('/');
        }

        // Find Token in DB
        const token = await Token.findOne({
            userID: user.id,
            token: req.params.token
        });

        // If token doesn't exist in DB --> redirect to Home
        if(!token){
            req.flash('error', "Invalid link or expired");
            return res.redirect('/');
        }

        // Set user password and save changes
        user.password = req.body.pwd;
        await user.save();

        // Delete generated token as it's work has been completed
        await Token.deleteOne({_id: token._id});

        req.flash('success', "password reset sucessfully!!");
        return res.redirect('/');
    }
}

// Delete all Existing User
async function deleteAllExistingUser(){
    try {
        await User.deleteMany({});
        return;
    } catch (err) {
        console.log(err);
        return;
    }
}

// Find all Existing User
async function findAllUsers(){
    try {
        const users = await User.find({});
        console.log("users : ", users);    
    } catch (err) {
        console.log("Error in getting all users data", err);
        return;
    }
    
}
