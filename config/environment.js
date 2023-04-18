const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
})

const development = {
    name: 'development',
    domain_name: 'localhost',
    mongodb_domain_name: '127.0.0.1',
    asset_path: './assets',
    views_path: './views',
    upload_path: '/uploads',
    session_cookie_key: 'blahsomething',
    db_name: 'closer_development',
    smtp:{
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "tv072000", // generated ethereal user
            pass: "wgmxrstfomplqemt", // generated ethereal password
        },
    },
    google_client_ID:     "598425896524-6c2gmoak5086q3dlvh8dp20pk8i9ek0b.apps.googleusercontent.com",
    google_client_secret: "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",
    google_callback_URL: "http://localhost:8000/users/auth/google/callback",
    jwt_key: 'closer',
    server_email: 'tv072000@gmail.com',
    server_port: 8000,
    mongodb_port: 27017,
    socket_port: 5000,
    morgan: {
        mode: 'dev',
        options: {stream : accessLogStream}
    }
};

const production = {
    name: 'production',
    domain_name: process.env.CLOSER_DOMAIN_NAME,
    mongodb_domain_name: process.env.CLOSER_MONGODB_DOMAIN_NAME,
    asset_path: process.env.CLOSER_ASSET_PATH,
    views_path: process.env.CLOSER_VIEWS_PATH,
    upload_path: process.env.CLOSER_UPLOAD_PATH,
    session_cookie_key: process.env.CLOSER_SESSION_COOKIE_KEY,
    db_name: process.env.CLOSER_DB_NAME,
    smtp:{
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.CLOSER_SMTP_USER, // generated ethereal user
            pass: process.env.CLOSER_SMTP_PASS, // generated ethereal password
        },
    },
    google_client_ID: process.env.CLOSER_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CLOSER_GOOGLE_CLIENT_SECRET,
    google_callback_URL: process.env.CLOSER_GOOGLE_CALLBACK_URL,
    jwt_key: process.env.CLOSER_JWT_KEY,
    server_email: process.env.CLOSER_SERVER_EMAIL,
    server_port: process.env.CLOSER_SERVER_PORT,
    mongodb_port: process.env.CLOSER_MONGODB_PORT,
    socket_port: process.env.CLOSER_SOCKET_PORT,
    morgan: {
        mode: 'combined',
        options: {stream : accessLogStream}
    }
};

module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV);