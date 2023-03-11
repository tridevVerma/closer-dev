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
    return res.redirect('/');
}

// logout user
module.exports.destroySession = (req, res) => {
    console.log(req.params); // user Id = req.params.id
    req.logout(function(err) {
        if (err) { return next(err); }
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
