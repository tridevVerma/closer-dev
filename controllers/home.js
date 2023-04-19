const Post = require('../models/Post');
const User = require('../models/User');

module.exports.home = async function (req, res) {
    try {
        /** Get all posts --> sort in descending order --> populate user(name, email) of each post
         * --> populate all likes on each post --> populate all comments (sorted: descending, nested populate user(name, email)
         * of each post
         */

        let posts = await Post.find({})
            .sort({ 'createdAt': -1 })
            .populate('user', 'name email')
            .populate('likes')
            .populate({
                path: 'comments',
                options: { sort: { 'createdAt': -1 } },
                populate: {
                    path: 'user',
                    select: { '_id': 1, 'name': 1, 'email': 1 },
                }
            });

        // Populate all users
        let users = await User.find();
        let loggedUser = undefined;
        if (req.user) {
            // If signed in --> Get all freinds (only names)
            loggedUser = await User.findById(req.user.id).populate('freinds', 'name');
        }
        return res.render('Home', {
            title: 'Home',
            posts,
            all_users: users,
            all_freinds: req.user ? loggedUser.freinds : undefined
        })
    } catch (error) {
        console.log("ERROR :", error);
        return;
    }


}

