const express = require('express');
var cookieParser = require('cookie-parser');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const app = express();
const port = 8000;

// set up body parser, cookieParser and static files
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static('assets'));

//set up ejs
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'closer',
    // Todo change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

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