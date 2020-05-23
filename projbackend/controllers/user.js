//user controller

//User model coming from models
const User = require("../models/user")

//OrderSchema coming from from order model
const Order = require("../models/order")

//exporting method so params can be handled
//getUserById works with the params because there is a id
//this is a middleware
exports.getUserById = (req, res, next, id) => {
    //using findbyid() on User model
    //chaining with .exec() so it does the execution and then using callback, whenever there is a database callback it 
    //always return two thing - error and user itself
    User.findById(id).exec((err, user) => {
        if(err || !user){
            //if there is an error or no user
            return res.status(400).json({
                error : "NO USER FOUND"
            })
        }
        //if no error was there that means user is found, 
        //we can create an object inside the request which can be called as profile and we can store this user inside it
        req.profile = user;
        //since its a callback
        next();
    })
}
//simple method, whenever someone calls it we want to grab an user
exports.getUser = (req, res) => {
    //come back here for password
    //req.profile has user from the last method
    //After testing in POSTMAN that user has all the details of user even the salt and encry password, we want to hide thet
    //we are not making them undefined in the database, we are just making them undefined in user profile
    req.profile.salt = undefined
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined
    return res.json(req.profile)
}

//User Update information Controller
exports.updateUser = (req, res) => {
    //using findByIdAndUpdate() on User model
    User.findByIdAndUpdate(
        //objects
        //find the user - this _id is coming up from when we are making a request on the route :userId, automatically 
        //middleware is going to fireup which is going to be userId which populates a field req.profile and sets it up
        {_id : req.profile._id},
        //the values we want to update - the values we want to update we pass them with $set, and i want to update 
        //everythin in my body, so thats where frontend kicks in
        {$set : req.body},
        //mandatory parameters when we use findByIdAndUpdate()
        //set new to true if updation is going on, set useFindAndModify to false
        {new : true, useFindAndModify : false},
        //getting callabck always give two thing, error and user object itself
        (err, user) => {
            if(err){
                //we dont need !user condition here in if statement as {_id : req.profile._id} will give error already if no user found
                return res.status(400).json({
                    error : "NOT AUTHORIZED TO UPDATE"
                })
            }
            //if no error found
            user.salt = undefined
            user.encry_password = undefined
            user.createdAt = undefined
            user.updatedAt = undefined
            res.json(user)
        }
    )
}

//User Purchase List Controller
exports.userPurchaseList = (req, res) => {
    //we can directly get this from userSchema in user model from purchase, but we ll get this from OrderSchema from order model
    //In order we ll find user and that user ll be based on req.profile._id which is populated by middleware by getUserById
    //And user in OrderSchema is found by the ref of the User model (ref : "User")
    //Since Anytime when you are referencing somethin in a different collection in which case this is "User" that is the
    //exact moment to use a populate
    Order.find({user : req.profile._id})
    //two things are passed compulsoraly i.e model or object that u want to update, and what are the fields that you 
    //want to bring in, so there are two fields _id and name
    .populate("user", "_id name")
    //chaining .exec() to execute
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error : "NO ORDER FOUND"
            })
        }
        return res.json(order)
    })
}

//Middleware to push the orders in purchases list(defalut) in user model
exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases = []
    //the information is coming up from req.body, we are going to call this up from frontend as it is order and in order
    //model we will be having multiple products that are going to be coming up here. Assuming there are many products 
    //so we are going to use this products, so in the order whatever the products we are going to have we are going to
    //loop through that we ll pick up individual infomation from there we ll create an object from it and we ll be
    //pushing it inside the purchases
    //products is an entire list in which there is in an individual product that i want to loop through it
    req.body.order.products.forEach(product => {
        //the information i ll put it up here is going to be inside purchases, and i ll push an object
        purchases.push({
            //the product ll carry an _id itself, we have a product model so definetly an _id will be there 
            _id : product._id,
            name : product.name,
            description : product.description,
            category : product.category,
            quantity : product.quantity,
            //Not coming from product its directly coming 
            amount : req.body.order.amount,
            transaction_id : req.body.order.transaction_id 
        })
    })
    //<Storing In Database>
    //we have pushed everything in local array-purchases in User model, now we have to push it in mongo DB
    //So far we have nothing in purchases[], but there ll be some point that there will be somethin and you dont want
    //to overwrite so findOneAndUpdate()
    User.findOneAndUpdate(
        //finfing on basis of _id
        {_id : req.profile._id},
        //what do u want to push inside this array, thats why $push and not $set
        //update this array in user model with my local array purchases
        {$push : {purchases : purchases}},
        //we get always two things from DB, error and the object itself, setting new as true means send the new updated
        //object from the DB and not the old one
        {new : true},
        //no need for exec(), we ll directly get our callback
        (err, purchases) => {
            if(err){
                return res.status(400).json({
                    error : "UNABLE TO SAVE PURCHASE LIST"
                })
            }
            //if error is there stop there or else handover the control forward
            next()
        }
    )
}