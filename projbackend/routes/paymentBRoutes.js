var express = require('express')
var router = express.Router()


//fix
const {getUserById} = require("../controllers/user")



const {isSignedIn, isAuthenticated} = require("../controllers/auth.js")

//fix 
router.param("userId", getUserById)

const {getToken, processPayment} = require("../controllers/paymentb")

router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken)

router.post("/payment/braintree/:userId", isSignedIn, isAuthenticated, processPayment)



module.exports = router
