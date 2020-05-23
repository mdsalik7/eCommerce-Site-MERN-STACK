var mongoose = require('mongoose');
const crypto = require('crypto'); //node.js-crypto docx 
//import { v1 as uuidv1 } from 'uuid'; //uuid docx, imported verson 1
const uuidv1 = require('uuid/v1');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    userinfo: {
        type: String,
        trim: true,
    },
    encry_password: {
        type: String,
        required: true
    },
    //salt(cryptography) back in the days we used normal text to store password, but now salt are used salt hashes the 
    //password
    salt: String,
    role : {
        type: Number,
        default : 0,
    },
    purchases: {
        type: Array,
        default : []
    }
}, 
{timestamps:true}
//timestamp will make sure that whenever i m making a new entry through this schema, it records the time of creation and
//store it in the database. Using this we can filter out things based on the time of there creation.
);

//the database is storing encry_pass, so we are creating another field through virtual 
//i.e password, as password is not getting stored directly to the database, we are simply refereing it as password, 
//but what actually stored in database is encry_password
userSchema.virtual("password") 
//Now in the fuction we are expecting that someone gives this password because while setting it up we want to use the 
//method securepassword which basically requires us to pass on this plain password
    .set(function(password){
        this._password=password //password coming from the user stored in a variable to keep it up safe, used underscore to make it a private variable
        this.salt=uuidv1(); //setting the salt field, now to populate the field called the uuid inbuilt method
        this.encry_password=this.securePassword(password) 
        //to set the encry_password field used the securePassword method and used this keyword to make sure that 
        //we are calling that one only which takes parameter password which was put by the user
    })
    //function for if someone wants the things to get back what was set
    .get(function(){
        return this._password
    })



//copied from node.js-crypto docx
//userSchema.methods can have as many as methods in it
userSchema.methods={
    //once a user set a password later on we might want to authenticate him, authenticate is a method which we can call 
    //and which will match these hashed values
    authenticate : function(plainpassword){
        return this.securePassword(plainpassword)===this.encry_password 
        //plainpassword which is given by the user is passed in the securePassword method to generate the hash value and
        //which is compared with the hashed value(encry_password) in the databasee to return true or false
    },

    //when this securePassword method will run it is going to covert the plainpassword into a secure password
    securePassword : function(plainpassword){
        if(!plainpassword) return "";
        try{
            return crypto.createHmac('sha256', this.salt) 
             //Parameter secret is refered to a value i.e salt
            .update(plainpassword) //plainpassword is passed and gets encrypted
            .digest('hex');
        }
        //we dont want to store it in variable, we simply return it
        catch(err){
            return "";
        }
       //we ll return an empty string and take the advantage of inbuilt feature of 
       //mongoDB, so the empty password cannot be stored
    }

};


module.exports=mongoose.model("User",userSchema)
//we have created but never using it and never throwing it out outside the file
//And there is a interesting way to deal it with dat
//so first u have to say module which exports a thing (This is common syntax used in node), then mongoose and throw out
//the model that we have just created, this accepts two values 1st one is the name, and the other one is the schema.
