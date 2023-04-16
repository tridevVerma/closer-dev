const Comment = require('../models/Comment');
const Post = require('../models/Post');
const commentMailer = require('../mailers/commentMailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.createComment = async (req, res) => {
    const commentData = req.body;
    const newComment = {
        content: commentData["comment-content"],
        user: req.user._id,
        post: commentData.post
    }
    
    try {
        const post = await Post.findById(commentData.post);

        if(post){
            let comment = await Comment.create(newComment);
            post.comments.push(comment);
            post.save();
            comment = await comment.populate({
                path: 'user',
                select: {'_id': 1, 'name': 1, 'email': 1}
            });
            
            // commentMailer.newComment(comment);
            let job = queue.create('emails', comment).save(err => {
                if(err){
                    console.log('Error in creating queue', err);
                    return;
                }
                console.log('job enqueued', job.id);
            })

            if(req.xhr){
                console.log("new comment", comment)
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
        }
        else{
            console.log("post not existing");
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Error in creating comment", err); return;   
    }
};

module.exports.destroyComment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;

            await Post.findByIdAndUpdate(postId, { $pull : {comments : req.params.id}});

            await Like.deleteMany({parent: req.params.id, onModel: 'Comment'});
            
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
        }
        else{
            return res.redirect('back');
        }
    } catch (err) {
         console.log("Can't Delete comment reference in post", err); return; 
    }
}