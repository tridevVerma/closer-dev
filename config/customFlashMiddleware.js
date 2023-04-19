// *********** Set locals.flash for views(ejs), so that req.flash() can return respective toast message **********
module.exports.customFlash = (req, res, next) => {
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    };

    next();
}