const Post = require('../models/Post');
const User = require('../models/User');

// module.exports.home = function(req, res){
    
//     Post.find({})
//         .populate('user')
//         .populate({
//             path: 'comments',
//             populate: {
//                 path: 'user',
//             }
//         })
//         .exec(function(err, posts){
//             if(err){ console.log("Can't Get All Posts"); return; }

//             User.find({}, (err, users) => {
//                 if(err){ console.log("Can't find all users in DB"); return; }
//                 return res.render('Home', {
//                     title : 'Home',
//                     posts,
//                     all_users : users
//                 })
//             })
//         });
// }

// using promises (then)
// Post.find({}).populate('user').then(function(err, posts){})

module.exports.home = async function(req, res){

    try {
        let posts = await Post.find({})
        .sort({'createdAt': -1})
        .populate('user', 'name email')
        .populate({
            path: 'comments',
            options: { sort: { 'createdAt': -1}},
            populate: {
                path: 'user',
                select: { '_id': 1,'name':1, 'email':1},
            }
        });

        let users = await User.find({});

        return res.render('Home', {
            title : 'Home',
            posts,
            all_users : users
        })
    } catch (error) {
        console.log("ERROR :", error);
        return;
    }
    

}

