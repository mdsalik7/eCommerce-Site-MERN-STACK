const mongoose = require('mongoose')
const {ObjectId}=mongoose.Schema
//You can define multiple schemas in the same file
const ProductCartSchema = new mongoose.Schema({
    //these are not created on the go, These product(in the cart) is based on the product that we have created in 
    //the past(all products in product), so this mean the product in the cart is based on the product in the productSchema
    product : {
        //soo we need to bring the product from there, *we have already brought that so we ll reuse it*
        type : ObjectId,
        ref : "Product"
    },
    //the things we want to see in the cart itself that which we will bring it down from the product itself
    name : String,
    count : Number,
    price : Number
    //can mention size, date of delivery, coupons etc here.

})

const ProductCart=mongoose.model("ProductCart",ProductCartSchema);

const OrderSchema = new mongoose.Schema({
    //OrderSchema ll consist of array of products but not actually products but the products which are 
    //in the cart because when the products are inside the cart new properties are introduced like how many 
    //quantity of product are you gettin and what is total of that
    products : [ProductCartSchema],
    transaction_id : {},
    amount : {type : Number},
    address : String,
    //status of the order, ENUM give restricted choices
    status : {
        type : String,
        default : "RECEIVED",
        enum : ["CANCELLED", "DELIVERED", "SHIPPED", "PROCESSING", "RECEIVED"]
    },
    //now whenever this ordered is placed it is going to be used by the admin of the page and the admin will provide 
    //some update on the order like when was the order placed when i have worked on it
    updated : Date,
    //we need to find out who is placing the order which user, later on we might use this OrderSchema and can do lot of
    //things like push these values or these product things into the user account as well
    user : {
        type : ObjectId,
        ref : "User"
    }
}, {timestamps : true}
);

const Order=mongoose.model("Order",OrderSchema);


//Throwing out the Models/Schehmas 

module.exports={Order,ProductCart}

