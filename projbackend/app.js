//Whenever there is a database involved with an application we want as soon as the applcation gets connected to the 
//database, at the launch of the application this file fires up first so we ll make the connection here in this file

//module that loads environment variables from a .env file into process.env, read Dotenv Docx
require('dotenv').config() //This means load the .env file and use all the variables inside it

const mongoose = require("mongoose");
//we require express as well because express is going to be responsible for listening the things as well
const express = require("express");
//we have created a app that uses express and then we use this variable express all the way or watever way we want to have it
const app = express();

//<Middleware>
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//<My Routes>
//After throwing route,
//There is some file existing somewhere that we are bringing the code from that file into this app.js
const authRoutes = require("./routes/auth.js")
const userRoutes = require("./routes/user.js")
const categoryRoutes = require("./routes/category.js")
const productRoutes = require("./routes/product.js")
const orderRoutes = require("./routes/order.js")
//payment route for braintree
const paymentBRoutes = require("./routes/paymentBRoutes.js")




//<Connection to Database> - mongoose docx
mongoose.connect(process.env.DATABASE, //url-string which we will be able to connect with the database(changed to variable which is present in env file).
//Process is where it attach all the new dependencies and env is the file that we have created and DATABASE is the name
//of the variable DATABASE
{
    useNewUrlParser : true,     //mandatory
    useUnifiedTopology : true,  //mongoose docx
    useCreateIndex : true   //mongoose docx
}).then(() => {
    console.log("DATABASE IS CONNECTED")
});
//connection chaining
//myfun.run().then().catch()
//lets say myfunction is there and I use a method of it, run() just like connect() above, and we then use a then() and 
//then we use a catch(), the then() will run when there is success in running the run() and the catch() will run when 
//there is some errors in run() to handle them 

//<Middleware>
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//<My Routes>
//if user wants to interact with backend he has to put "/api" before on everything(every route)
//This code means - So whenever we go to '/api/signout' route we want to run authRoutes
app.use("/api",authRoutes)  //authRoute is authentication route
app.use("/api",userRoutes)
app.use("/api",categoryRoutes)
app.use("/api",productRoutes)
app.use("/api",orderRoutes)
app.use("/api",paymentBRoutes)




//<Port>
//we will create a port to listen to, so the database is running as soon as the application is running
const port = process.env.PORT || 8000; 
//Right now everything is being developed on localhost, but someday this project ll go to server, so we need to take some 
//precautions. There are sensitive information in every project like keys, private keys, payment gateways, and if this 
//project gets into github these infomation can be seen including the database url and with that lot of mischieve things
//can be done. So this is why environment variables are used. (.env file does not get uploaded on github/repo)
//We can see the port is 8000 but in real world the deployers dont allow you to see this port like that,
//they recommned to use variable, because if then they change the port it wont affect the users 


//<Creating a Server>
//app listen on a port 
app.listen(port, () => {
    console.log(`App is running at ${port}`)
})