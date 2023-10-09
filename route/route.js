const express = require("express");
const router = express.Router();
const client = require("../model/db.js");
var bodyParser = require('body-parser');  

var urlencodedParser = bodyParser.urlencoded({ extended: false });
const loginController = require("../controller/loginController.js");
const { isAuthorized } = require("../controller/auth.js");
const HomeController = require("../controller/HomeController.js");
const BookController = require("../controller/BookController.js");


//Login 
router.get("/",loginController.userLoginPage);
router.post("/",loginController.userAuthenticate);

//Register
router.get("/register",loginController.userRegisterPage);
router.post("/register",loginController.userRegister);

//change to Post
router.post("/logout",loginController.userLogout);

//Books Library
router.get("/home",isAuthorized,HomeController.HomePage);

//Create New Book
router.get("/create/book",isAuthorized,BookController.createBookPage);
router.post("/create/book",isAuthorized,BookController.createBook);

module.exports = router;