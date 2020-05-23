//Inorder to save the user into the databsae we have to bring the model - user
const User = require("../models/user") 

//for validationResult - express-validator docx
const { check, validationResult } = require('express-validator');

//generate token - read docx - jsonwebtoken
var jwt = require('jsonwebtoken');

//Judge wether a user is authenticated or not - read docx - expressjwt
var expressJwt = require('express-jwt');

//Since signout is moved here we need to export it as well from here to routes
exports.signout = (req,res) => {
    //CLearing the cookies to make sure user gets signed out, we have this .clearCookie() because we have cookie-parser
    //clearCookie takes the name of the cookie to delete it
    res.clearCookie("token")
    //res.send("User Signout")
    //throwing json(key-value pair) response instead of above response
    res.json({
        message : "User Signout Successful"
    });
};

 
exports.signup = (req,res) => {
    //where this errors is going to comeup from? Well this express validator binds the validationResult 
    //with the req body - Given in the docx
    const errors = validationResult(req)
    //Assuming errors been populated, if errors is not empty then sending a response back with the error detail(Message)
    if(!errors.isEmpty()){
        //return keyword is imp here i dont want my method should be executing after that, once it hits the return it
        //means its not going execute my method after this point
        //status code 422 means from database and sending json
        return res.status(422).json({
            //errors is an object which gives an array, so we need to covert it into array, then the very first index of
            //the array gives us the details like location, msg, param -- Read Express Validator docx
            //from the above we take out the information from msg using . notation
            error : errors.array()[0].msg

        })
    }

    /* 
    //taking advantage of a middleware - bodyParser to get the values passed from the frontend/postman
     //logging the information that passed from frontend/postman to the cmd, req.body will have access to those info
     console.log("REQ BODY",req.body)
     res.json({
         message : "Signup Works!"
     })
     */
    
    const user = new User(req.body)
    //This variable or object created from a class User which is further being created from the class of mongoose 
    //or variable mongoose we can access all the database methods(populate,save..) that mongoose provide us
    //we also want to provide a response back so people know that operation was a success or not
    user.save((err,user) => {
        //this call callback gives us two paramters(saving data to db gives us two properties back always) -
        //error and user itself(the data we saved in our db)
        if(err){
            //if there was an error we want to send a response with a status code of 400 - BAD REQUEST
            //we are also sending a json, if these json are parsed nicely, the frontend developer will craft a msg nicely
            return status(400).json({
                err: "Not Able To Save User In Database"
            })
            //if error was encountered after returning the status code and json will control ll comeout from save() and
            //thus the below code will not execute 
        }
        //if there is not a error then instead of if block the control will come to this line and ll return json
        res.json({
            name : user.name,
            email : user.email,
            id : user._id
        });
    });
};


//for signin route -
//We first check wether user is giving all the informations(email & password) to login, then we check wether this email 
//exist or not in our database then we check our password was correct or not, if all was great then the user gets loggedin
exports.signin = (req,res) => {
    //Previously in Signup we were passing all the information that was coming up from the user into the body to the database
    //but in signin from the body we need to extract email and password only
    const {email,password} = req.body
    //validationCheck same as signup
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg
        })
    }
    //now email and password is coming up from the route, we ll take advantage od User model and we ll use findOne() of mongoose
    //findOne() will find the first one from the database based on the email that we passed here
    //this callback will always return two things one error and other is user itself
    User.findOne({email},(err,user) => {
        //if there is an error or if there is no user that means the user doesnt exist in our database
        if(err || !user){   //COME HERE - VIDEO 7.4
            return res.status(400).json({
                error : "User Doesnt Exist In Our Database"
            })
        }
        //if there is no error then we have to check for password matches or not
        //user got returned to us if no error was found above
        //authenticate is a method in user model which authenticate on basis of plainpassword, and plainpassword is here
        //paswword which was extracted earlier above with email
        if(!user.authenticate(password)){
            //if only the password doesnt match this if block will execute
            return res.status(401).json({
                error : "Email And Password Doesnt Match"
            })
        }
        //if the password matches we have to sign in the user - that means create a token put that token into the cookies
        //Creating a token, used sign() to create signin() based on any key value pair (used id of user)
        //2nd parameter - random string to generate token is inside .env
        const token = jwt.sign({_id : user._id},process.env.SECRET)
        //Putting token to cookie
        //sending response as cookie, cookie is almost like key value pair
        //res.cookie("name to call the cookie",token,date of expiry for token)
        res.cookie("token",token,{expire : new Date() + 9999})

        //sending response to the frontend as this is all happening in backend
        //deconstructing user to get info to send to the frontend
        const {_id, name, email, role} = user;
        //sending token so the frontend appiaction can set this token into local storage and sending user
        //which we deconstructed as an user object which ll have id,name,email,role
        return res.json({token,user : {_id, name, email, role}})
    })

}


//protected routes
//read docx - expressjwt, use expressjwt then simply create an object and pass secret , which is coming from .env file
exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    //cookieParser allows us to set some of the properties inside the users browser so we can call this as userProperty
    //Can use anything to call it, but using auth as it is user personal authentication
    //Once we are giving a middlware and we are using it on any route, it just add a new property inside the request
    //which is user property auth and auth holds user _id, This _id is same as _id which was given at the time of signin
    userProperty : "auth"
});

//custom middlewares
//we dont have anythin similar like expressjwt checkout for authentication, isAdmin, so custom middleware
exports.isAuthenticated = (req, res, next) => {
    //variable checker checks for user is authenticated or not
    //first we are taking request as user is makin request to some of the route
    //through the frontend we are going to make a property inside the user which is going to be known as profile and 
    //this property is only going to be set if the user is logged in, bascally if u have any information like email id role of the user
    let checker = req.profile && req.auth && req.profile._id == req.auth._id // ==  as because they both are different object and we checking for the values only
    //above code means
    //req.profile is going to be set from the frontend, req.auth is going to be set by the top middleware(isSignedIn)
    //and then we are checkin that the profile id we have set by the frontend if it is equal to the auth id which is set 
    //by the middleware(isSignedIs) are same that means user is authenticated to change things in his own account
    if(!checker){
        //if checker is false
        return res.status(403).json({
            error : "ACCESS DENIED!!"
        })
    }
    next()
}


exports.isAdmin = (req, res, next) => {
    //Inside user model we have put a field name role with default 0, if its 0 the user is a normal user
    //if its 1 the user is an Admin
    //profile is going to be set from the frontend
    if(req.profile.role === 0){
        return res.status(403).json({
            error : "NOT AN ADMIN, ACCESS DENIED"
        })
    }
    next()
}
