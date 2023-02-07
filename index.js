const express = require('express');
var cookieParser = require('cookie-parser');
const db = require('./config/mongoose');
const app = express();
const port = 8000;

//set up ejs
app.set('view engine', 'ejs');
app.set('views', './views');

// set up routes and static files
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static('assets'));
app.use('/', require('./routes/index'));

app.listen(port, (err) => {
    if(err){
        console.log("ERROR : Server can't be started");
        return;
    }

    console.log(`Server started successfully at port no : ${port}`);
})