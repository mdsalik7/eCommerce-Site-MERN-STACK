const Product = require("../models/product")
const formidable = require("formidable") //read formidable npm docx
const _ = require("lodash") //read lodash docx - We want to have a variable but dont want to use it much explicitly so _
const fs = require("fs") //Whenever the user will browse for the images so File System for path of the files is required

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
    //we can definetly get all products here but we want to get products based on category so used .populate()
    .populate("category")
    .exec((err, product) => {
        if(err){
            return res.status(400).json({
                error : "PRODUCT NOT FOUND"
            })
        }
        req.product = product
        next()
    })
}

exports.createProduct = (req, res) => {
    //createProduct will use form data
    //creation of a form using formidable.IncomingForm
    let form = new formidable.IncomingForm()
    
    //to see the files are jpeg or png
    form.keepExtensions = true

    //parsing the form, This expects 3 parameters - error, fields(name,descrpition,price) and file
    form.parse(req, (err, fields, file) => {
        //Either we get an error or fields and file
        if(err){
            return res.status(400).json({
                error : "PROBLEM WITH THE IMAGE"
            })
        }


        //destructure the properties coming up from the fileds (fields.name, fields.description...)
        //so that instead of calling fields.name, fields.description... we simply call it name, description...
        //sold will not come from user itself as we ll design it as a middlewaare, once something gets sold, stock will get minus and sold will get up
        const {name, description, price, category, stock} = fields 

        //Restrictions on fields
        //instead of this, we should have created restriction on auth(routes) itself
        if(!name || !description || !price || !category || !stock){
            return res.status(400).json({
                error : "ALL FIELDS ARE MANDATORY"
            })
        }

        //if no restriction, create an object of product type using Product model directly from fields
        //product is created on based of the fields
        //assuming and relying on the users that they will put all the information(fields) and that in the correct format
        let product = new Product(fields)


        //Handle file here
        //if file has a photo
        if(file.photo){
            //if photo size is > 3mb - 1024*1024*3mb(size) - read formadible docx
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error : "FILE SIZE TOO BIG"
                })
            }
            //if file size under 3mb, include file in the product
            //product.photo.data means inside photo model in the photo{} there is data of type buffer and contentType String, 
            //fill the data with the file that is being passed through file system and conetntType with the type of the file(JPEG,PNG..)
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        //Now product is ready to get into the Database
        //product is the object of mongoose so we can call .save() on it
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error : "SAVING TSHIRT IN DATABASE FAILED"
                })   
            }
            res.json(product)
        })
    })
}

exports.getProduct = (req, res) => {
    //mp3s or photos are not directly given to get request, because they are tricky and bulky to grab from database
    req.product.photo = undefined //performance optimization
    //If we are getting one single product, we have req.product = product in our middleware getProductById above, 
    //that gives us the product id, if we want to get one product just populate that from req.product
    return res.json(req.product)
}

//performance optimization
//middleare to get the photo in the frontend
exports.photo = (req, res, next) => {
    //if photo has data
    if(req.product.photo.data){
        //set content-type from the photo
        res.set("Conetnt-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next()
}

exports.deleteProduct = (req, res) => {
    let product = req.product
    //remove() is in mongoose, since we are interacting with the db which will give 2 things, error and object itself which was removed
    product.remove((err,deletedProduct) => {
        if(err){
            return res.status(400).json({
                error : "FAILED TO DELETE THE PRODUCT"
            })
        }
        res.json({
            message : "SUCCESSFULLY DELETED",
            deletedProduct
        })   
    })

}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    
    //to see the files are jpeg or png
    form.keepExtensions = true

    //parsing the form, This expects 3 parameters - error, fields(name,descrpition,price) and file
    form.parse(req, (err, fields, file) => {
        //Either we get an error or fields and file
        if(err){
            return res.status(400).json({
                error : "PROBLEM WITH THE IMAGE"
            })
        }
        //instead of creating a new product we ll grab the existing one, we are getting this as because in update/put
        //route we have used :productId, seeing this param will fire up and will hold the product
        let product = req.product
        //update the product using lodash, lodash extend() takes existing values in an object and extends the value and it 
        //also updates the value, it requires 2 things, first the field to look for, and second update the field with which are in the formidable.
        //this _.extend(product, fields) code means now these fields will be updated inside the product
        product = _.extend(product, fields)


        //Handle file here
        //if file has a photo
        if(file.photo){
            //if photo size is > 3mb - 1024*1024*3mb(size) - read formadible docx
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error : "FILE SIZE TOO BIG"
                })
            }
            //if file size under 3mb, include file in the product
            //product.photo.data means inside photo model in the photo{} there is data of type buffer and contentType String, 
            //fill the data with the file that is being passed through file system and conetntType with the type of the file(JPEG,PNG..)
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        //Now product is ready to get into the Database
        //product is the object of mongoose so we can call .save() on it
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error : "UPDATION OF TSHIRT IN DATABASE FAILED"
                })   
            }
            res.json(product)
        })
    })   
}

exports.getAllProducts = (req, res) => {
    //limit to show the number of products, this limit can be default and can also be decided by the user from frontend
    //if there is a query from the frontend that has the property .limit then execute the query or else use the default
    //input taken or selected from the frontend is string so parseInt
    let limit = req.query.limit ? parseInt(req.query.limit) : 8 //ternary operator
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id" //default sortBy _id
    Product.find()
    //photos can throw a response which is bit late so do not select the photos
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]]) //sortBy asscending order, sortBy can be name, _id, creation date, popular..
    .limit(limit)
    .exec((err,products) => {
        if(err){
            return res.status(400).json({
                error : "NO PRODUCT FOUND"
            })
        }
        res.json(products)
    })
}

//middleware to update inventory(stock and sold) using .bulkWrite()
//we can have two middlewares one for handling the stock and the other for sold, but we ll make only one and handle with mongoose .bulkWrite()
//this is the middleware which will use in the frontend soo no route for this
exports.updateStock = (req, res, next) => {
    //we are going to have a cart and in this cart there ll be many products, and i ll loop into this cart and grab each
    //product and perform operations like number of stock left and number of sold done after a success purchase of the product
    //In order there ll be many products and we ll loop using .map
    //while looping through order, we ll get many products, and in every product(prod) we ll perform two operation decrease
    //stock and increase sold 
    let myOperations = req.body.order.products.map(prod => {
        //returning object - read mongoose bulkWrite docx
        return {
            //for every single prod fire this updateOne method
            updateOne : {
                //find the product based on its id so to perform operation(stock- and sold+) on that particular product only
                filter : {_id : prod._id},
                //perform update operation(increament) : decrease stock count and increase sold count
                //we ll be throwing this count(sold) from the frontend, coz mayb a user is taking 3 pieces of exact product
                update : {$inc : {stock : -prod.count, sold : +prod.count}}
            }
        }
    })
    //it has 3 parameter to pass on - the operation we want to perform, the options we want to give and callback
    //Option is null for now
    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                error : "BULK OPERATION FAILED"
            })
        }
        //if no error
        next()
    })
}

//In my admin panel user ll be able to create a product and select a category for that product
//this method grabs all the distinct categories and display in the frontend so user can choose the category for the product
exports.getAllUniqueCategories = (req, res) => {
    //instead of .findById and .save(), we have Model.distinct() which gives distinct and unique values
    //it takes 3 parameters - from which field you want to get it, options and callback
    Product.distinct("category", {}, (err, category) => {
        if(err){
            return res.status(400).json({
                error : "NO CATEGORY FOUND"
            })
        }
        res.json(category)
    })
}

