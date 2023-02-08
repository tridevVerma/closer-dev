const User = require('../models/User');

module.exports.profile = function (req, res) {
    if (req.cookies.userId) {
        // user logged in
        User.findById(req.cookies.userId, (err, user) => {
            if (err) {
                console.log("Error in getting logged user's data");
                return;
            }

            if (user) {
                // console.log("logged user : ", user);
                res.render('Users', {
                    title: "User's Profile",
                    user,
                });
            }
            else{
                res.redirect('/users/login');
            }

        })
    }
    else {
        // user not logged in
        res.redirect('/users/login');
    }
}

// render signup page
module.exports.signup = function (req, res) {
    if(req.cookies.userId){
        return res.redirect('/users/profile');
    }
    return res.render('Signup', { title: "Signup" });
}

// render login page
module.exports.login = function (req, res) {
    if(req.cookies.userId){
        return res.redirect('/users/profile');
    }
    return res.render('Login', { title: "Login" });
}

// get sign up data
module.exports.create = (req, res) => {
    if (req.body.password !== req.body.confirm_password) {
        res.redirect('back');
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            console.log("Error in finding user in signing up");
            return;
        }

        if (!user) {
            User.create(req.body, (err, user) => {
                if (err) {
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
    User.findOne({ email: req.body.email }, (err, user) => {
        // steps to authenticate

        if (err) {
            // error in finding user
            console.log("Error in finding user for signin");
            return;
        }
        if (!user) {
            // user not found
            console.log("User doesn't exist");
            return res.redirect('/users/signup');
        }
        else {
            // user email matched

            if (user.password !== req.body.password) {
                // user password incorrect
                return res.redirect('back');
            }
            else {
                // user is authenticated
                res.cookie('userId', user.id)
                return res.redirect('/users/profile');
            }
        }
    })

}

module.exports.logout = (req, res) => {
    // console.log("query : ", req.query);
    console.log(req.params);
    res.clearCookie('userId');
    return res.redirect('/')
}

function deleteAllExistingUser() {
    User.deleteMany({}, (err, msg) => {
        if (err) {
            console.log("Error in Deleting all Existing Users");
            return;
        }
        console.log(msg);
    })
}

function findAllUsers() {
    User.find({}, (err, users) => {
        if (err) {
            console.log("Error in getting all users data");
            return;
        }
        console.log("users : ", users);
    })
}