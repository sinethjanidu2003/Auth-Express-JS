const express = require("express");
const router = require("./route/route.js");
const path = require("path"); 
const bodyParser = require('body-parser');  
const session = require('express-session');

require('dotenv').config();


const app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//app Settings
app.use(urlencodedParser);
app.use(express.static(__dirname + "/public"));
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(
    session({
      secret: 'ExpressJS@900',
      resave: true,
      saveUninitialized: true,
    })
  );

//3000 connectiong to server
app.listen(process.env.PORT || 3000,( )=>{
    console.log("Server is running and up with a port ");
});


//routes
app.use(router);


