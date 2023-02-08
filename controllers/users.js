const User = require('../models/User');

module.exports.profile = function(req, res) {
    res.render('Users', {
        title : "User's Profile"
    });
}

// render signup page
module.exports.signup = function(req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('Signup', {title : "Signup"});
}

// render login page
module.exports.login = function(req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('Login', {title : "Login"});
}

// get sign up data
module.exports.create = (req, res) => {
    if(req.body.password !== req.body.confirm_password){
        res.redirect('back');
    }

    User.findOne({email: req.body.email}, (err, user) => {
        if(err){
            console.log("Error in finding user in signing up");
            return;
        }
        
        if(!user){
            User.create(req.body, (err, user) => {
                if(err){
                    console.log("Error in creating user in signing up");
                    return;
                }
                console.log("********new user created*******", user);
            });
        }
        return res.redirect('/users/login');
        
    })
}

// sign in and create session for the user
module.exports.createSession = (req, res) => {
    return res.redirect('/users/profile');
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