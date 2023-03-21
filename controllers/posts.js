const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Add User's Post

module.exports.createPost = async (req, res) => {
    
    const newPost = {title: req.body["post-title"], content: req.body["post-content"], user: req.user._id};
    
    try {
        const post = await Post.create(newPost); 
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
    
    // async await 
    
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        // .id means converting _id to string format
        if(post.user == req.user.id){
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

    // callback hell

    // const post = await Post.findById(req.params.id, (err, post) => {
    //     if(err) { console.log("Can't find post to destroy"); return; }

    //     // .id means converting _id to string format
    //     if(post.user == req.user.id){
    //         post.remove();
    //         Comment.deleteMany({post: req.params.id}, (err, msg) => {
    //             if(err){console.log("Can't delete comments when destroying posts"); return; }
    //             return res.redirect('back');
    //         })
    //     }
    //     else{
    //         return res.redirect('back');
    //     }
    // })
}