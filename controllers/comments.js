const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Like = require('../models/Like');
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
        // Find post on which comment was made
        const post = await Post.findById(commentData.post);

        if(post){
            
            // If post exist --> create new comment and push it in db's comments array
            let comment = await Comment.create(newComment);
            post.comments.push(comment);

            // Save changes
            post.save();

            // Populate each comment with user-name and user-email
            await comment.populate('user', 'name email');
            
            /** --> Directly use nodeMailer to send Mail <-- **/
            // commentMailer.newComment(comment);

            /** --> Use Kue with Redis [to store jobs(mail)] to be sent via nodeMailer <-- **/
            // let job = queue.create('emails', comment).save(err => {
            //     if(err){
            //         console.log('Error in creating queue', err);
            //         return;
            //     }
            //     console.log('job enqueued', job.id);
            // })

            if(req.xhr){
                // If it's an ajax request
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
            console.log("post does not exist");
            return res.redirect('back');
        }
    } catch (err) {
        console.log("Error in creating comment", err); return;   
    }
};

module.exports.destroyComment = async (req, res) => {
    try {
        // Find comment with params
        const comment = await Comment.findById(req.params.id);

        // If comment found and signed user is same as user who created that comment --> delete it
        if(comment && comment.user == req.user.id){
            let postId = comment.post;

            await Comment.deleteOne({_id: comment._id});

            // Delete comment from post's array of comments
            const post = await Post.findById(postId);
            await post.comments.pull(comment._id)
            
            // Save changes
            await post.save();

            // Delete all likes on that particular comment
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