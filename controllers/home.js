module.exports.home = function(req, res){
    console.log('Cookies: ', req.cookies);
    res.cookie('user_id', '100')
    return res.render('Home', {
        title : 'Home'
    })
}