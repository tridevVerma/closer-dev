const Post = require('../models/Post');

module.exports.home = function(req, res){
    // Post.find({}, function(err, posts){
    //     if(err){ console.log("Can't Get All Posts"); return; }
    //     return res.render('Home', {
    //         title : 'Home',
    //         posts,
    //     })
    // })
    
    Post.find({}).populate('user').exec(function(err, posts){
        if(err){ console.log("Can't Get All Posts"); return; }
        return res.render('Home', {
            title : 'Home',
            posts,
        })
    });
}
