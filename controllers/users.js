const User = require('../models/User');

module.exports.profile = function(req, res) {
    User.findById(req.params.id, (err, user) => {
        if(err){ console.log("Can't find user in DB to view profile"); return; }
        res.render('Users', {
            title : "User's Profile",
            profile_user : user
        });
    })
    
}

module.exports.updateProfile = (req, res) => {
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
            if(err){ console.log("can't update users profile"); return; }
            return res.redirect('back');
        })
    }
    else{
        return res.status(401).send('Unauthorized');
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
        res.redirect('back');
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
    req.flash('success', "Logged in successfully!!");
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

function deleteAllExistingUser(){
    User.deleteMany({}, (err, msg) => {
        if(err){
            console.log("Error in Deleting all Existing Users");
            return;
        }
        console.log(msg);
    })
}

function findAllUsers(){
    User.find({}, (err, users) => {
        if(err){
            console.log("Error in getting all users data");
            return;
        }
        console.log("users : ", users);
    })
}
