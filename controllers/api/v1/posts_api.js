const Post = require('../../../models/Post');
const Comment = require('../../../models/Comment');

module.exports.getPosts = async (req, res) => {

    try {
        // Get all posts -> sort(desc) -> populate user (name, email) -> populate comments (nested populate user (name, email))
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user', 'name email')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: { '_id': 1,'name':1, 'email':1},
            }
        });

        return res.status(200).json({
            "messages" : "List of Posts",
            "posts" : posts
        })
    } catch (error) {
        console.log("ERROR :", error);
        return;
    }
}

module.exports.destroyPosts = async (req, res) => {
    try {
        // Find if post exist
        const post = await Post.findById(req.params.id);

        // If post found and signed user is same as user who created that post --> delete it
        if(post.user == req.user.id){

            // Delete post
            await deleteOne({_id: post._id});

            // Delete all comments attached to that post
            await Comment.deleteMany({post: req.params.id});

            return res.status(200).json({
                message: "Posts and associated comments deleted!!"
            });
        }
        else{
            return res.status(401).json({
                message: "Unauthorized access : You cannot delete this post!!"
            });
        }

    } catch (err) {
        console.log("***************", err)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}