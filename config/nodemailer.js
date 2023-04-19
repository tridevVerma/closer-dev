const env = require('../config/environment');
const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');

// Create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(env.smtp);

// Create general template function which takes data and views(ejs) which will be send together to email
let renderTemplate = (data, relativePath) => {
    let mailHTML;

    // ejs.renderFile takes --> VIEWS(ejs) file path, DATA to be filled in, CALLBACK fn() with generated template
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){ console.log('Error in rendering mail template', err); return; }
            mailHTML = template;
        }
    );

    return mailHTML;
}

module.exports = {
    transporter,
    renderTemplate
}