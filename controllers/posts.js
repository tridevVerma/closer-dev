const Post = require('../models/Post');

// Add User's Post

module.exports.createPost = (req, res) => {
    console.log(req.body);
    const newPost = {title: req.body["post-title"], content: req.body["post-content"], user: req.user._id};
    Post.create(newPost, function(err, post){
        if(err){
            console.log("Error in creating Post");
            return;
        }
        console.log("*************Post Created**************");
        console.log(post)
        return res.redirect('back');
    })
};

