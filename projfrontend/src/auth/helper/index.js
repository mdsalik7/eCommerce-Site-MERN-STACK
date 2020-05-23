//importing API from backend.js
import {API} from '../../backend'

//this signup is going to take user as a parameter which ll come as a json from the frontend
export const signup = user => {
    //talking to the DB by API call
    //signup is the route that we created for signing up and when we do this signup we need to pass some information

    return fetch(`${API}/signup`, {
        //since we are passing information to the DB so method is POST
        method : "POST",
        //Our application expects headers and stuff
        headers : {
            //whatever we used to mention in our POSTMAN
            Accept : "application/json",
            "Content-Type" : "application/json"
        },
        //the most information to pass on is the body, and will pass the Json of the user
        body : JSON.stringify(user)
    })
    //if everything goes succes, we ll get a response back
    .then(response => {
        //so whatever the response is coming up we are converting it to json and just giving it back to frontend 
        return response.json()
    })
    //if fail
    .catch(err => console.log(err))
}

export const signin = user => {
    return fetch(`${API}/signin`, {
        method : "POST",
        headers : {
            Accept : "application/json",
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

//we taken and handled a json response in signin, but browser doesnt remember this json response, so we have to do some
//stuff to make sure that user is continuosly signed in  once he hit the signin route successfuly so well create a
//authenticate method - this ll set a token "jwt" when the user successfuly signin 
export const authenticate = (data, next) => {
    //if window object is not undefined, simply widow object is accessible to us
    if(typeof window !== "undefined"){
        //if 'if' statement is true then access the local storage of the react and set the jwt token with json.stringify(data)
        localStorage.setItem("jwt", JSON.stringify(data))
        next()
    }
}


export const signout = next => {
    if(typeof window !== "undefined"){
        //remove the set "jwt" token
        localStorage.removeItem("jwt")
        next()

        //we also need to logout the user from backend
        return fetch(`${API}/signout`, {
            method : "GET"
        })
        .then(response => console.log("SignOut Success"))
        .catch(err => console.log(err)) 
    }
}

//validation if the user is signed in or not
export const isAuthenticated = () => {
    //we are saving the jwt in the window object, if the window object is undefined then return false, 
    //jwt is not there or set meaning user is not authenticated
    if(typeof window == "undefined"){
        return false
    }
    //if we get the window object then we are not directly returning true, rather returning the value of jwt and in the 
    //frontend meaning our component, the token is checked again wether it is same as the user we are looking up for 
    //then this JSON.parse(localStorage.getItem("jwt") statement ll fireup as true; Parsing this means that the 
    //authentication ll be true hopefully
    if(localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"))
    } else {
        return false
    }
} 
