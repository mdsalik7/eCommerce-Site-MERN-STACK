var express = require('express')
var router = express.Router()

const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth.js")
const {getUserById, pushOrderInPurchaseList} = require("../controllers/user.js")
const {updateStock} = require("../controllers/product.js")
const {getOrderById, createOrder, getAllOrders, getOrderStatus, updateStatus} = require("../controllers/order.js")


//params
router.param("userId", getUserById)
router.param("orderId", getOrderById)

//<Actual routes>
//Create Order
//if the user visit the route, fire isSignedIn, isAuthenticated, then pushOrderInPurchaseList(purchase) then updateStocka and then run the createOrder method
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder)

//Read Order
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders)

//update status of order
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus)
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus)




module.exports = router
