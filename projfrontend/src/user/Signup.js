import React, {useState} from 'react'
import Base from '../core/Base'
import {Link} from 'react-router-dom'
import {signup} from "../auth/helper"


const Signup = () => {
    //State is used to store the data that are coming up from form before actually we are submitting it to the database
    const [values, setValues] = useState({
        name : "",
        email : "",
        password : "",
        error : "",
        success : false
    }) 
    //watever we have put in the useState is part of values, so if we want to access anything we have to use values.name,
    //values.email etc so instead of calling values. every time we ll use deconstructing
    const {name, email, password, error, success} = values

    //when somebody types something into the form and we want to get exactly what he is typing and want to put this into
    //the store, handleChange will be the method for this
    const handleChange = name => event => {
        //we dont directly manipulate the values(name,email,password) we use set in react
        //setValues takes the values you want to manipulate, ...values loads all the existing values, then we say error
        //as false because we are going to render something based on this error element, now we are going to pass multiple
        //values from name and watever is the value replace with event.target.value, which means "name", "email" .. below
        setValues({...values, error : false, [name] : event.target.value})
    } 

    //when someone clicks the submit button
    const onSubmit = event => {
        //the default action on when you submit the form it takes it somewhere it is just prevented so we can do other stuff
        event.preventDefault()
        //load all values and make the error false so we can show some stuff based on that
        setValues({...values, error : false})
        //as we have defined signup in auth/helper/index.js, it takes user and stringify it but we can get it directly
        signup({name, email, password})
        //since this method automatically fires a request to the backend and just give response and error
        .then(data => {
            //if then happens obviously we get a data as back response
            if(data.error){
                //the data has either values or error, if there is error load all values and set the error whatever 
                //the error is and succes ll be false
                setValues({...values, error : data.error, success : false})
            } else {
                //if no error, load all the values, and reset everything as everything is still there in the box where we have written the info
                setValues({
                    ...values,
                    name : "",
                    email : "",
                    password : "",
                    error : "",
                    success : true
                })
            }
        })
        .catch(console.log("Error in SignUp"))
    }


    const signUpForm = () => {
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                            <label className="text-light">Name</label>
                            <input className="form-control" onChange={handleChange("name")} type="text" value={name}/>
                        </div>
                        <div className="form-group">
                            <label className="text-light">Email</label>
                            <input className="form-control" onChange={handleChange("email")} type="email" value={email}/>
                        </div>
                        <div className="form-group">
                            <label className="text-light">Password</label>
                            <input className="form-control" onChange={handleChange("password")} type="password" value={password}/>
                        </div>
                        <button className="btn btn-success btn-block" onClick={onSubmit}>Submit</button>
                    </form>
                </div>
            </div>
        )
    }

    //method to display success message
    const successMessage = () => {
        return (
            //flex box property of bootstap, show when there is success or show nothing
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-success" style={{display : success ? "" : "none"}}>
                        New Account was Created Successfully. Please <Link to="/signin">Login Here</Link>      
                    </div>
                </div>
            </div>
        )
    }
    //method to display error message
    const errorMessage = () => {
        return (
            //flex box property of bootstap, show when there is error or show nothing
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-danger" style={{display : error ? "" : "none"}}>
                        {error}
                    </div>
                </div>
            </div>
        )
    }


    return(
        <Base title="SignUp Page" description="A page for user to SignUp!">
            {successMessage()}
            {errorMessage()}
            {signUpForm()}
            <p className="text-white text-center">{JSON.stringify(values)}</p>
        </Base>
    )
}

export default Signup;