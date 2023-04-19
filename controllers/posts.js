const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

// Add User's Post
module.exports.createPost = async (req, res) => {
    
    const newPost = {
        title: req.body["post-title"], 
        content: req.body["post-content"], 
        user: req.user._id
    };
    
    try {
        // Create post
        let post = await Post.create(newPost); 
        if(req.xhr){
            return res.status(201).json({
                data: {
                    post: post,
                    username: req.user.name
                },
                message: "Post created!!"
            })
        }
        req.flash('success', "Post published!!");
        return res.redirect('back');    
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }
};

module.exports.destroyPost = async (req, res) => {
    
    try {
        const post = await Post.findById(req.params.id);

        // .id means converting _id to string format
        if(post.user == req.user.id){
            // If post found and signed user is same as user who created that post --> delete it
            await Post.deleteOne({_id: post._id});

            // Delete all likes on that post
            await Like.deleteMany({parent: req.params.id, onModel: 'Post'});
            
            // Delete all likes on the comments which are commented on that post
            await Like.deleteMany({parent: {$in: post.comments}, onModel: 'Comment'});
            
            // Delete all comments of tha post
            await Comment.deleteMany({post: req.params.id});
            
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                })
            }
            req.flash('success', "Post and associated comments deleted!!");
            return res.redirect('back');
        }
        else{
            req.flash('error', "You cannot delete this post!!");
            return res.redirect('back');
        }

    } catch (err) {
        req.flash('error', err);
    }
}