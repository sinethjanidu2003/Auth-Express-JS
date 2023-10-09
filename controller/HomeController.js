const express = require("express");
const Client = require("../model/db.js");



function homePage(req,res,next){

    
    res.render("home.ejs");
}


exports.HomePage = homePage;