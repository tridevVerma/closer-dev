const Like = require('../models/Like');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

module.exports.like = async(req, res) => {
    try {
        const {type, id} = req.query;
        let parentType, likeAdded = false;

        if(type === 'Post'){
            parentType = await Post.findById(id).populate('likes');
        }
        else{
            parentType = await Comment.findById(id).populate('likes');
        }
        
        let existingLike = await Like.findOne({
            parent: id, 
            onModel: type, 
            user: req.user._id
        });
        
        
        if(existingLike){
            // check if current logged used liked post/comment
            // let hasLiked = req.user.id === existingLike.user ? true : false;
            
            // like already exist --> delete it
            await parentType.likes.pull(existingLike._id);
            await parentType.save();
            await Like.deleteOne({_id: existingLike.id});
            likeAdded = false;
        }else{
            let newLike = await Like.create({
                user: req.user._id,
                parent: id,
                onModel: type,
            });
            await parentType.likes.push(newLike._id);
            await parentType.save();
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