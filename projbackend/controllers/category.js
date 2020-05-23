const Category = require("../models/category")

//<middleware>
exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err,cate) => {
        if(err){
            return res.status(400).json({
                error : "CATEGORY NOT FOUND IN DATABASE"
            })
        }
        req.category = cate
        next()
    })
}

exports.createCategory = (req, res) => {
    //Creating category which we extract from the user body,
    //we ll create an object "category" from the Category which we have imported from the model which ll have req.body 
    //which is going to be populated from this
    const category = new Category(req.body)
    //while saving, interacting with the Database will give two stuff error and category object itself
    category.save((err, category) => {
        if(err){
            return res.status(400).json({
                error : "NOT ABLE TO SAVE CATEGORY IN DATABASE"
            })
        }
        //if no error send json response with category
        res.json({category})
    })
}

exports.getCategory = (req, res) => {
    //If we are getting one single category, we have req.category = cate in our middleware getCategoryById above, 
    //that gives us the category id, if we want to get one category just populate that from req.category
    return res.json(req.category)
}

exports.getAllCategory = (req, res) => {
    Category.find().exec((err,categories) => {
        if(err){
            return res.status(400).json({
                error : "NO CATEGORIES FOUND"
            })
        }
        res.json(categories)
    })
}

exports.updateCategory = (req, res) => {
    //grabbing from the request, req.category thats what we are sending
    //we are able to grab this req.category because of the middleware above getCategoryById, we are able to grab from 
    //the parameters and then we are populating this category because of the middleware
    const category = req.category
    //this line is responsible for grabbing category name which is sent from the frontend/Postamn
    category.name = req.body.name
    //updating to db
    category.save((err,updatedCategory) => {
        if(err){
            return res.status(400).json({
                error : "FAILED TO UPDATE CATEGORY"
            })
        }
        res.json(updatedCategory)
    })
}

exports.removeCategory = (req, res) => {
    const category = req.category
    //remove() is in mongoose, since we are interacting with the db which will give 2 things, error and object itself which was removed
    category.remove((err,category) => {
        if(err){
            return res.status(400).json({
                error : "FAILED TO DELETE THE CATEGORY"
            })
        }
        res.json({
            message : "SUCCESSFULLY DELETED"
        })   
    })
} 