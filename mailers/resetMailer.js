const env = require('../config/environment');
const nodeMailer = require('../config/nodemailer');

exports.resetPWD = function(user, link){
    
    // Generate HTML from views(ejs) and data
    let htmlString = nodeMailer.renderTemplate({user, link}, '/reset_pwd.ejs');

    // Send Mail
    nodeMailer.transporter.sendMail({
        from: env.server_email,
        to: user.email,
        subject: "Reset Your Password",
        html: htmlString
    }, (err, info) => {
        if(err){
            console.log("Error in sending mail to reset pwd", err);
            return;
        }
        // console.log("Mail deleivered", info);
        return;
    });

} 