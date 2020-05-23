var express = require('express')
var router = express.Router()

const {getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, removeCategory} = require("../controllers/category.js")
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth.js")
const {getUserById} = require("../controllers/user.js")


//<params>
router.param("userId", getUserById)
router.param("categoryId", getCategoryById)


//<actual routes>
//<Create Routes>
//routes for posting information in database
//create category if the user with userid isisSignedIn, isAuthenticated, and isAdmin
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory)


//<Read Routes>
//route for getting single category
//To get one single category have to put :categoryId, when there is :categoryId it ll run 
//router.param("categoryId", getCategoryById), this "categoryId" paramater will fire up getCategoryById route,
//req.category gets populated by cate and fire a controller getCategory
router.get("/category/:categoryId", getCategory)
//route for getting all the categories
router.get("/categories", getAllCategory)


//<Update Routes>
//route to update the name of the category for certain category so :categoryId by a certain user so :userId
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory)


//<Delete Routes>
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory)


module.exports=router;