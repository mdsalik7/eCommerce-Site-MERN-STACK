import React, {useState} from 'react'
import Base from '../core/Base'
import {Link, Redirect} from 'react-router-dom'
//importing index.js from auth/helper
import {signin, authenticate, isAuthenticated} from "../auth/helper"

const Signin = () => {
    const [values, setValues] = useState({
        email : "lala@gmail.com",
        password : "12345",
        error : "",
        loading : false, //for loading message
        //redirect the user to user panel or admin panel based on their role, it is going to come from 'react-router-dom'
        didRedirect : false
    })

    const {email, password, error, loading, didRedirect} = values
    //isAuthenticated() returns JSON.parse entire local storage object which has this jwt, so we are holding the things
    //that are returned 
    const {user} = isAuthenticated()

    const handleChange = name => event => {
        setValues({...values, error : false, [name] : event.target.value})
    }

    const onSubmit = event => {
        event.preventDefault()
        setValues({...values, error : false, loading : true})
        signin({email, password})
        .then(data => {
            if(data.error){
                setValues({...values, error : data.error, loading : false})
            } else {
                //authenticate is kind of middleware, and this requires to pass on the data, we just need to give the
                //data and it will set all the values, authenticate() also has next, and whenever there is a next we can 
                //fire back a callback
                authenticate(data, () => {
                    //and it ll clear back everythin from the input form
                    setValues({
                        ...values,
                        didRedirect : true
                    })
                })
            }
        })
        .catch(console.log("Signin request failed"))
    }

    //method to check wether redirect should be done or not and where to redirect
    const perfromRedirect = () => {
        if(didRedirect){
            //didRedirect is an object in our state
            if(user && user.role === 1){
                //if we have a user which is coming from isAuthenticated() and user has lots of properties, 
                //if the user role is 1, that means he is an admin, so redirect him to admin panel
                return <Redirect to="/admin/dashboard"/>
            } else {
                return <Redirect to="/user/dashboard"/>
            }
        }
        if(isAuthenticated()){
            //if the user is authenticated, isAuthenticated will give a true or false, if true this ll redirect to Homepage
            return <Redirect to="/" />
        }
    };

    //method to display loading message
    const loadingMessage = () => {
       return (
           //loading can be true or false, and the component is always true, So based on loading things are going to work
           //if loading is true, then T && T, and this ll execute, else F && T and it ll not execute
           loading && (
               <div className="alert alert-info">
                   <h2>Loading...</h2>
               </div>
           )
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





    const signInForm = () => {
        return(
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
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

    return(
        <Base title="SignIn Page" description="A page for user to SignIn!">
            {loadingMessage()}
            {errorMessage()}
            {signInForm()}
            {perfromRedirect()}
            <p className="text-white text-center">{JSON.stringify(values)}</p>
        </Base>
    )
}

export default Signin;