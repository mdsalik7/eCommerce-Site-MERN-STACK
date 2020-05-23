var express = require('express')
var router = express.Router()

const {getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts, getAllUniqueCategories} = require("../controllers/product.js")
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth.js")
const {getUserById} = require("../controllers/user.js")

//<params>
router.param("userId", getUserById)
router.param("productId",getProductById)

//<actual routes>
//create product if the user with userid isisSignedIn, isAuthenticated, and isAdmin
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct)

//grabbing single product
router.get("/product/:productId", getProduct)
router.get("/product/photo/:productId", photo) //performance optimization

//delete routes
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct)

//update routes
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct)

//getallproduct routes
router.get("/products", getAllProducts)

//list distinct Categories in the admin panel
router.get("/products/categories", getAllUniqueCategories)


module.exports=router;
