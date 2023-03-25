const Post = require('../../../models/Post');
const Comment = require('../../../models/Comment');

module.exports.getPosts = async (req, res) => {

    try {
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
        const post = await Post.findByIdAndDelete(req.params.id);

        // .id means converting _id to string format
        if(post.user == req.user.id){
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