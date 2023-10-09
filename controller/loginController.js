const express = require("express");
const Client = require("../model/db.js");
const md5 =  require("md5");
const session = require('express-session');


async function userLoginPage(req,res){


    const collection = await checkCollectionCreated("Users");


    const logged = await checkSession(req.session.user,collection, req);


    if(logged){
        return res.redirect("/home");
    }else{
        const message = req.query.message || "";
        res.render('Login/userLogin.ejs',{message});
    }

}


async function userAuthenticate(req,res){
    

    //Check the if the user exists
    const collection = await checkCollectionCreated("Users");

    //check if Logged In
    //const logged = await checkSession(req.session.user,collection, req);


    const data = {
        email : req.body.email,
        password : md5(req.body.password)
    };

    const checker = await checkUserExists(collection , data.email);
    if(checker){

        //find all the data are correct 
        const user = await collection.findOne(data);
        if(user){
            //Create Session and Move Forward
             // Generate a random string
            const randomString = generateRandomString(30);
            const sessionToken = md5(randomString);

            req.session.sessionToken = sessionToken;
            req.session.user = user;

            const storedSession = await storeSession(user,collection,req);
            
            if(storeSession)
                console.log("Session stored");

            return res.redirect("/home");

        }else{
            //Auth Error 
            var message = "Authentifction Failed; Try Again";
            return res.redirect('/?message=' + message);
        }

    }else{
        var message = "Authentifction Failed; Try Again";
        return res.redirect('/?message=' + message);
    }


    
}


async function storeSession(user,collection,req){


    //updating the session token
    user.sessionKey = req.session.sessionToken;
    await collection.updateOne({_id: user._id}, {$set : user});

}


async function checkSession(user,collection,req){
    
    if(user){
        const sessionKey = await collection.findOne({_id: user._id});
        if(sessionKey == user.sessionToken){
            return true;
        }else{
            return false;
        }

    }else{
        return false;
    }
}


function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }
  
 

async function userRegisterPage(req,res){

    const collection = await checkCollectionCreated("Users");


    const logged = await checkSession(req.session.user,collection, req);


    if(logged){
        return res.redirect("/home");
    }else{
        res.render('Login/register.ejs');
    }
    
}


async function userRegister(req,res){
    
    //checking db and collections
    const collection = await checkCollectionCreated("Users");

    if(req.body.email != "" ){
        const data = {
            email : req.body.email,
            password : md5(req.body.password)
        };
    
        //check if the use exists
        const checker = await checkUserExists(collection,data.email);
    
        if(!checker){
            const result = await collection.insertOne(data);
    
            return res.send("User Created Successfully, You can Log in Now !");
        }else{
            var message = "User already Exists !";
            return res.redirect('/?message=' + message);
        }
    }else{
        console.log("Required Removed from HTML");
        res.status(401).send('Data Changed ! Unathorized ');
    }

   

    
    
}

async function checkUserExists(collection , email){
    return await collection.findOne({email : email});
}

async function checkCollectionCreated(collectionName){
    /* Private function : used to check the database and collections*/

    //creating the database if not exists
    const db = Client.db("BookDatabase");
    //checking the collection : if not create the collection
    const collections = (await db.listCollections().toArray()).filter(c=>c.name === "Users");
    if(collections === null){
        db.createCollection(collectionName);
    }

    const collection = db.collection(collectionName);
    return collection;
}




function userLogOut(req,res){
    req.session.destroy((err) => {
        if (err) {
          console.error('Error destroying session:', err);
        }
        // Redirect or send a response indicating successful logout
        res.redirect('/?message=logout%20Succssfully!');
      });
}


exports.userLoginPage = userLoginPage;
exports.userAuthenticate = userAuthenticate;
exports.userRegisterPage = userRegisterPage;
exports.userRegister = userRegister;
exports.userLogout = userLogOut;
