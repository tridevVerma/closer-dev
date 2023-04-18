const express = require('express');
var cookieParser = require('cookie-parser');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy'); // passport -> local strategy
const passportJwt = require('./config/passport-jwt-strategy');  // passport -> jwt strategy
const passportGoogle = require('./config/passport-google-oauth2-strategy'); // passport -> google strategy
const MongoStore = require('connect-mongo');
var expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const {customFlash} = require('./config/customFlashMiddleware.js');
const env = require('./config/environment.js');
const path = require('path');
const app = express();
const port = env.server_port;

// chat-box setup
const chatServer = require('http').Server(app);
const {chatSockets} = require('./config/socket.js');
chatSockets(chatServer);
chatServer.listen(env.socket_port, function(){
    console.log(`Chat server listening on port ${env.socket_port}`)
});

// set up body parser, cookieParser and static files
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(env.asset_path));
app.use(env.upload_path, express.static(path.join(__dirname, env.upload_path)));   // make the upload path available to the browser

// set up express-ejs-layouts
app.use(expressLayouts);
app.set("layout extractScripts", true)
app.set("layout extractStyles", true)

// set up ejs
app.set('view engine', 'ejs');
app.set('views', env.views_path);

// Mongo store is used to store the session cookie in the db
app.use(session({
    name: 'closer',
    // Todo change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({mongoUrl: `mongodb://${env.mongodb_domain_name}:${env.mongodb_port}/${env.db_name}`}),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// configure flash messages (already configured cookie-parser and express-session above)
app.use(flash());
app.use(customFlash)
// set up routes
app.use('/', require('./routes/index'));

// starting server
app.listen(port, (err) => {
    if(err){
        console.log("ERROR : Server can't be started");
        return;
    }

    console.log(`Server started successfully at port no : ${port}`);
})