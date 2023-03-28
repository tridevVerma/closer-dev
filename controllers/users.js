const path = require('path');
const fs = require('fs');
const User = require('../models/User');
// view profile to logged user
module.exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('Users', {
            title : "User's Profile",
            profile_user : user
        });
    } catch (err) {
        console.log("Can't find user in DB to view profile", err); return;
    }
}

// update profile of logged user
module.exports.updateProfile = async (req, res) => {
    // try {
    //     if(req.user.id == req.params.id){
    //         await User.findByIdAndUpdate(req.params.id, req.body);
    //         req.flash('success', "Profile Updated!!")
    //         return res.redirect('back');
    //     }
    //     else{
    //         return res.status(401).redirect('back');
    //     }
    // } catch (err) {
    //     console.log("can't update users profile", err); return; 
    // }

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
    req.flash('success', "Logged in!!");
    return res.redirect('/');
}

// logout user
module.exports.destroySession = (req, res) => {
    console.log(req.params); // user Id = req.params.id
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', "You have logged out!!");
        res.redirect('/');
    });
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
