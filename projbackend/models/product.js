const mongoose = require('mongoose')
//Every product belong to some kind of category, so we have encountered that we need to create a relation btween product
//schema and category schema. To do that we have used a property of mongoose "ObjectId"
const {ObjectId}=mongoose.Schema //Deconstructing, Here I can pullout the ObjectId, but from where i m going to pull that ObjectId out from? It can be from category and also user *
const productSchema = new mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : true,
        maxlength : 32,
    },
    description : {
        type : String,
        trim : true,
        required : true,
        maxlength : 2000
    },
    price : {
        type : Number,
        trim : true,
        required : true,
        maxlength : 32,
    },
    //defining category of the product by linking the product to category schema
    category : {
        type : ObjectId, 
        ref : "Category", 
        //* so next thing is mention where this Objectid is going to comeup from, and that is done from reference 
        //parameter, mention exact thing you have thrown it out(ex-category.js),
        required : true
    },
    stock : {
        type : Number
    },
    sold : {
        type : Number,
        default : 0
    },
    photo : {
        data : Buffer,
        contentType : String
    }
}, 
{timestamps : true}
);

module.exports=mongoose.model("Product",productSchema);