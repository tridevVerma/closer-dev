const Post = require('../models/Post');
const Comment = require('../models/Comment');

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

module.exports.destroyPost = (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        if(err) { console.log("Can't find post to destroy"); return; }

        // .id means converting _id to string format
        if(post.user == req.user.id){
            post.remove();
            Comment.deleteMany({post: req.params.id}, (err, msg) => {
                if(err){console.log("Can't delete comments when destroying posts"); return; }
                return res.redirect('back');
            })
        }
        else{
            return res.redirect('back');
        }
    })
}