const env = require('../config/environment');
const nodeMailer = require('../config/nodemailer');

exports.newComment = function (comment){

    // Generate HTML from views(ejs) and data
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/new_comment.ejs');

    // Send Mail
    nodeMailer.transporter.sendMail({
        from: env.server_email,
        to: comment.user.email,
        subject: "New Comment Published",
        html: htmlString
    }, (err, info) => {
        if(err){
            console.log("Error in sending mail", err);
            return;
        }
        // console.log("Mail deleivered", info);
        return;
    })
}