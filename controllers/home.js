const Post = require('../models/Post');
const User = require('../models/User');

module.exports.home = function(req, res){
    // Post.find({}, function(err, posts){
    //     if(err){ console.log("Can't Get All Posts"); return; }
    //     return res.render('Home', {
    //         title : 'Home',
    //         posts,
    //     })
    // })
    
    Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
            }
        })
        .exec(function(err, posts){
            if(err){ console.log("Can't Get All Posts"); return; }

            User.find({}, (err, users) => {
                if(err){ console.log("Can't find all users in DB"); return; }
                return res.render('Home', {
                    title : 'Home',
                    posts,
                    all_users : users
                })
            })
        });
}

