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
const path = require('path');

const app = express();
const port = 8000;

// set up body parser, cookieParser and static files
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static('assets'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));   // make the upload path available to the browser

// set up express-ejs-layouts
app.use(expressLayouts);
app.set("layout extractScripts", true)
app.set("layout extractStyles", true)

// set up ejs
app.set('view engine', 'ejs');
app.set('views', './views');

// Mongo store is used to store the session cookie in the db
app.use(session({
    name: 'closer',
    // Todo change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({mongoUrl: "mongodb://127.0.0.1:27017/closer_development"}),
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