const Like = require('../models/Like');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

module.exports.like = async(req, res) => {
    try {
        // type --> parent type of like [Post, Comment], id --> parent[Post, Comment] ID
        const {type, id} = req.query;

        let parentType;

        if(type === 'Post'){
            // If parent is Post --> find that Post and populate all likes on it
            parentType = await Post.findById(id).populate('likes');
        }
        else{
            // If parent is Comment --> find that Comment and populate all likes on it
            parentType = await Comment.findById(id).populate('likes');
        }
        
        let existingLike = await Like.findOne({
            parent: id, 
            onModel: type, 
            user: req.user._id
        });
        
        // Check if like added or removed
        likeAdded = false;

        if(existingLike){
            // like already exist --> delete it from parent likes array and from Like collection
            await parentType.likes.pull(existingLike._id);
            await parentType.save();
            await Like.deleteOne({_id: existingLike.id});

            // like removed
            likeAdded = false;
        }else{
            // like doesn't exist --> create like entry in Like collection and push it to parent likes array
            let newLike = await Like.create({
                user: req.user._id,
                parent: id,
                onModel: type,
            });
            await parentType.likes.push(newLike._id);
            await parentType.save();

            // like added
            likeAdded = true;
        }

        return res.status(200).json({
            message: "successfully liked post/comment",
            count: parentType.likes.length,
            likeAdded
        });
        
    } catch (err) {
        console.log("Error in Likes:", err);
        return res.status(500).json({
            message: "Error occurred while liking post/comment",
        });
    }
}