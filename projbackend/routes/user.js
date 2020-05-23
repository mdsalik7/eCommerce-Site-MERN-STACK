var express = require('express')
var router = express.Router()


const {getUserById, getUser, updateUser, userPurchaseList} = require("../controllers/user.js")

//Exporting here so we can use the middlewares to protect the routes by isSignedIn, isAuthenticated, isAdmin
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth.js")

//read express - router.param - docx
//the method which is going to populate my req.profile is getUserById from user controller
//the implementation of this is whenever there is anythin inside any route which says :something, that will be interepreted
//as user id and this method will automatically populate a req.profile object with user object that is coming up from the DB
router.param("userId", getUserById)

//with all the routes associated with user, i ll say user infront of them and then :userId and the controller which will 
//be running on this is getUser from user controller
//if the user wants to get all the information like name email, so before getting his profile he should be siggned in and authenticated as well so middleware used
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)

//route to update user information
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)

//route to get purchase list of user
//want to store the entire list of what user is purchasing in the user model in purchases {}
//we ll take advantage of populate(), which lets reference documents in other collections, from mongoose - read docx
//we ll populate the user{} in orderSchema in order model as order model is dependent on user
//:userId - I have also got my middleware (userId) populate here who is just gonna look for getUserById and populate 
//everythin in req.profile - router.param("userId", getUserById)
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList)







module.exports=router;