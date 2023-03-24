const Post = require('../../../models/Post');

module.exports.posts_api = async (req, res) => {

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

        return res.json({
            "messages" : "List of Posts",
            "posts" : posts
        })
    } catch (error) {
        console.log("ERROR :", error);
        return;
    }


}