const Client = require("../model/db.js");


async function ConnectCollection(){
    const db = Client.db("BookDatabase");
    //checking the collection : if not create the collection
    const collections = (await db.listCollections().toArray()).filter(c=>c.name === "Users");
    if(collections === null){
        db.createCollection("Users");
    }

    const collection = db.collection("Users");
    return collection;
}


module.exports.isAuthorized  = async function(req, res, next) {


    const user = req.session.user;

    const collection = await ConnectCollection();


    //Middleware for authentification
    if(user){
        const sessionKey = await collection.findOne({email: user.email});
        if(sessionKey.sessionKey === req.session.sessionToken){
            next();
        }else{
            
            req.session.destroy();
            res.redirect('/');
        }

    }else{
        req.session.destroy();
        res.redirect('/');
   }

}





