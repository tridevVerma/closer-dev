const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Add User's Post

module.exports.createPost = async (req, res) => {
    
    const newPost = {title: req.body["post-title"], content: req.body["post-content"], user: req.user._id};
    
    try {
        const post = await Post.create(newPost); 
        console.log("*************Post Created**************");
        console.log(post)
        return res.redirect('back');    
    } catch (error) {
        console.log("Error in creating Post", error);
        return;
    }
};

module.exports.destroyPost = async (req, res) => {
    
    // async await 
    
    try {
        const post = await Post.findById(req.params.id);

        // .id means converting _id to string format
        if(post.user == req.user.id){
            post.remove();
            await Comment.deleteMany({post: req.params.id});
            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }

    } catch (err) {
        console.log("can't destroy posts!!");
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