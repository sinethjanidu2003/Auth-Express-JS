const express = require("express");
const Client = require("../model/db.js");
const nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'email@emai.com',
      pass: 'password'
    }
  });
  

function createBookPage(req,res){

    res.render("createBook.ejs");
}


function createBook(req,res){

    var mailOptions = {
        from: 'youremail@gmail.com',
        to: 'myfriend@yahoo.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      res.send("main sent");

}
exports.createBookPage = createBookPage;
exports.createBook = createBook;