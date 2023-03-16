const Comment = require('../models/Comment');
const Post = require('../models/Post');

module.exports.createComment = (req, res) => {
    const commentData = req.body;
    const newComment = {
        content: commentData["comment-content"],
        user: req.user._id,
        post: commentData.post
    }

    Post.findById(commentData.post, (err, post) => {

        if(err){ console.log("Error in finding post", err); return; }

        if(post){
            Comment.create(newComment, (err, comment) => {
                if(err){ console.log("Error in posting comment", err); return; }
                post.comments.push(comment);
                post.save();
                if(req.xhr){
                    return res.status(201).json({
                        data: {
                            comment,
                            username: req.user.name,
                        },
                        message: "Comment Added"
                    })
                }
                req.flash('success', "Comment created!!");
                res.redirect('/');
            })
        }  
    })
};

module.exports.destroyComment = (req, res) => {
    Comment.findById(req.params.id, (err, comment) => {
        if(err) {console.log("Can't find comment to destroy"); return; }
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();

            Post.findByIdAndUpdate(postId, { $pull : {comments : req.params.id}}, (err, post) => {
                if(err) { console.log("Can't Delete comment reference in post"); return; }
                if(req.xhr){
                    return res.status(200).json({
                        data: {
                            comment_id: req.params.id
                        },
                        message: "Comment deleted!!"
                    })
                }
                
                req.flash('success', "Comment removed!!");
                return res.redirect('back');
            })
        }
        else{
            return res.redirect('back');
        }
    })
}