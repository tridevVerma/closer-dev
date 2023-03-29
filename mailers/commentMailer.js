const nodeMailer = require('../config/nodemailer');

exports.newComment = function (comment){

    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/new_comment.ejs')
    nodeMailer.transporter.sendMail({
        from: "tv072000@gmail.com",
        to: comment.user.email,
        subject: "New Comment Published",
        html: htmlString
    }, (err, info) => {
        if(err){
            console.log("Error in sending mail", err);
            return;
        }
        console.log("Mail deleivered", info);
        return;
    })
}