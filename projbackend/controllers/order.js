//from order model we are throwing two things - Order, ProductCart
const {Order, ProductCart} = require("../models/order")

exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
    //populating the name and price of individual product because order is comprised of varities of products
    //from products we bring product, and grab infromation like name and price for that particular product
    .populate("products.product", "name price")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error : "NO ORDER FOUND"
            })
        }
        req.order = order
        next()
    })
}

//rememinder - In the orders route while we are creating a order schema, there is a field user, which is based on User model
exports.createOrder = (req, res) => {
    //req.profile as because it is dependent on user, req.profile is populated by param getUserById
    req.body.order.user = req.profile //**req.body.order from the frontend mayb
    const order = new Order(req.body.order)
    //since now order is object of mongoose we can do .save()
    order.save((err, order) => {
        if(err){
            return res.status(400).json({
                error : "FAILED TO SAVE ORDER IN DATABASE"
            })
        }
        res.json(order)
    })
} 

exports.getAllOrders = (req, res) => {
    //Order is mongoose object so .find(), passing nothing in find() will list everythin
    Order.find()
    //populate a user and the information i m looking up from that model are _id and name
    .populate("user", "_id name")
    .exec((err, order) => {
        if(err){
            return res.status(400).json({
                error : "NO ORDERS FOUND IN DATABASE"
            })
        }
        res.json(order)
    })
}

exports.getOrderStatus = (req, res) => {
    //In Order model we have schema, and we want to grab the status which is based on enum - read docx for syntax
    res.json(Order.schema.path("status").enumValues)

}

exports.updateStatus = (req, res) => {
    //In Order model update operation 
    Order.update(
        //grabbing _id from the frontend
        {_id : req.body.orderId},
        //update, setiing status on based req.body.status
        {$set : {status : req.body.status}},
        (err, order) => {
            if(err){
                return res.status(400).json({
                    error : "CANNOT UPDATE ORDER STATUS"
                })
            }
            res.json(order)
        }
    )
}
