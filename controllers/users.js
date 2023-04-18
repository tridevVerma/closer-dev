const env = require('../config/environment');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Token = require('../models/Token');
const crypto = require('crypto');
const resetMailer = require('../mailers/resetMailer');

// view profile to logged user
module.exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('freinds', 'name');
        
        let removeFreind;
        for(let f of user.freinds){
            if(f.id === req.user.id){
                removeFreind = true;
                break;
            }
        }
        
        res.render('Users', {
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
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log("****Multer Error****", err);
                    return;
                }
                user.email = req.body.email;
                user.name = req.body.name;

                if(req.file){

                    if(user.avatar){
                        const avatarfilePath = path.join(__dirname, "..", user.avatar);
                        if(fs.existsSync(avatarfilePath)){
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
        return res.redirect('/');
    }
    return res.render('Signup', {title : "Signup"});
}

// render login page
module.exports.login = function(req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    return res.render('Login', {title : "Login"});
}

// get sign up data
module.exports.create = async (req, res) => {
    
    if(req.body.password !== req.body.confirm_password){
        req.flash('error', "password and confirm password didn't match");
        return res.redirect('back');
    }

    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            await User.create(req.body);
            req.flash('success', 'User created Successfully');
        }
        else{
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
    // user Id = req.params.id
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
        return res.redirect('/');
    }
    return res.render('ResetPwd', {title : "ResetPassword"});
}

// reset password
module.exports.createToken = async function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }

    try {
        const user = await User.findOne({email: req.body.email})
        if(user){
            
            let token = await Token.findOne({userID: user._id});
            if(!token){
                token = await Token.create({
                    userID: user._id,
                    token: crypto.randomBytes(20).toString('hex')
                });
            }
            // console.log('token', token);
            const resetLink = `http://${env.domain_name}:${env.server_port}/users/reset-pwd/${user.id}/${token.token}`;
            resetMailer.resetPWD({name: user.name, email: user.email}, resetLink);
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

    if(req.body.pwd !== req.body['confirm-pwd']){
        req.flash('error', "Password and Confirm Password didn't matched");
        return res.redirect('/users/reset-pwd');
    }
    else{
        const user = await User.findById(req.params.id);
        if(!user){
            req.flash('error', "Invalid link or expired");
            return res.redirect('/');
        }
        const token = await Token.findOne({
            userID: user.id,
            token: req.params.token
        });

        if(!token){
            req.flash('error', "Invalid link or expired");
            return res.redirect('/');
        }

        user.password = req.body.pwd;
        await user.save();
        await Token.deleteOne({_id: token._id});
        req.flash('success', "password reset sucessfully!!");
        return res.redirect('/');
    }
}

async function deleteAllExistingUser(){
    try {
        await User.deleteMany({});
        return;
    } catch (err) {
        console.log(err);
        return;
    }
}

async function findAllUsers(){
    try {
        const users = await User.find({});
        console.log("users : ", users);    
    } catch (err) {
        console.log("Error in getting all users data", err);
        return;
    }
    
}
