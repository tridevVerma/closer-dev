const express = require('express'); // express for handling backend
const cors = require('cors');
var cookieParser = require('cookie-parser');  // Parse Cookie header and populate req.cookies with an key / secret
const db = require('./config/mongoose');    // mongoose configuration
const session = require('express-session'); // to store signed user data and then authenticate using this data
const passport = require('passport');   // to use different authentication strategies
const passportLocal = require('./config/passport-local-strategy'); // passport -> local strategy
const passportJwt = require('./config/passport-jwt-strategy');  // passport -> jwt strategy
const passportGoogle = require('./config/passport-google-oauth2-strategy'); // passport -> google strategy
const MongoStore = require('connect-mongo');  // to store signed user data (session) in mongodb
var expressLayouts = require('express-ejs-layouts');  // use layouts with ejs
const flash = require('connect-flash');  // to show toast messages
const {customFlash} = require('./config/customFlashMiddleware.js');  // toast messages configuration
const env = require('./config/environment.js');  // configuration of development / production environment
const logger = require('morgan');  // to store logs in seperate file
const path = require('path'); // path handling module
const app = express();  // initiate express-app
require('./config/viewHelper')(app);  // provide app to be used by viewHelper to provide local fn to all views
const port = env.server_port;
app.use(cors());
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

// set up morgan to store logs
app.use(logger(env.morgan.mode, env.morgan.options));

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

// Initialize passport and provide session to authenticate and save signed user data
app.use(passport.initialize());
app.use(passport.session());

// Set signed user info from session cookie to req.locals to be accessible by views
app.use(passport.setAuthenticatedUser);

// configure flash messages (already configured cookie-parser and express-session above)
app.use(flash());
// setup custom flash to store req.flash() toast msg by server to res.locals.flash which can be accessed by views(ejs) 
app.use(customFlash);

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