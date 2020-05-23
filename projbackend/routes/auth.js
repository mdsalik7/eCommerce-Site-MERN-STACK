//Express Routing docx - express.Router
var express = require('express')
var router = express.Router()
//importing methods from controller-auth.js
const {signout, signup, signin, isSignedIn} = require("../controllers/auth.js")
//for check - express-validator docx
const { check, validationResult } = require('express-validator');

/*
Moved to controller - auth.js
const signout = (req,res) => {
   //res.send("User Signout")
   //throwing json(key-value pair) response instead of above response
   res.json({
       message : "User Signout"
   })
}
*/


//Route for signout
//Instead of using app.get to create route, we ll use express route - Express Routing docx
router.get("/signout",signout)

//Route for signup
//1.We ll pass on some information from the frontend like name, email, etc this ll take it to a function 
//which ll add entry to the database, so instead of get we are using post method to post information to database.
//2.check is applied after the route and before the controller
router.post("/signup",
[
    //check("field to be checked","custom page")
    check("name","Invalid Name, Minimum Length : 3").isLength({ min: 3 }),
    check("email","Invalid Email").isEmail(),
    check("password","Invalid Password, Minimum Length : 5").isLength({ min: 3 }),

],signup)


//route for signin
//this will be also post as because i m taking info from the user
router.post("/signin",
[
    //check("field to be checked","custom page")
    check("email","Invalid Email").isEmail(),
    check("password","Invalid Password").isLength({ min: 1 }),

],signin)

//testroute
//if testroute is visited execute callback method instead of throwing it to the controller through isSigned
//isSigned is a middleware but we are not callin next() bcoz in IsSigned we are using expressJwt & it is taking care of it 
router.get("/testroute", isSignedIn, (req,res)=>{
    //res.send("A Protected Route")
    res.json(req.auth);
});


//Throwing it out outside of the file
//now all the links and requests i.e get or post associated with router on this port will be automatically thrown out
module.exports=router;
//we have thrown this route but we have not got it in app.js