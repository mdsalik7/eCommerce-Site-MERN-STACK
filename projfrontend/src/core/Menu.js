import React, {Fragment} from 'react'
//Since we ll be using this nav bar all around other pages, we need react router dom
//withRouter helps with the compatibilty between this nav bar as well as the router file we have created
import {Link, withRouter} from 'react-router-dom'
import { signout, isAuthenticated } from '../auth/helper'

//Method for active currentTab nav-bar colour, it is going to give two things - history, path
//history is something which is given to us by Link and we cant change the name of this variable and path is active path
const currentTab = (history, path) => {
    if(history.location.pathname === path) {
        return {color : "#2ecc72"}
    } else {
        return {color : "#FFFFFF"}
    }
}

//nav bar or menu bar component
//passing history as props
const Menu = ({history}) => (
    <div>
        <ul className="nav nav-tabs bg-dark">
            <li className="nav-item">
                <Link style={currentTab(history, "/")} className="nav-link" to="/">
                    Home
                </Link>
            </li>
            <li className="nav-item">
                <Link style={currentTab(history, "/cart")} className="nav-link" to="/cart">
                    Cart
                </Link>
            </li>
            {isAuthenticated() && isAuthenticated().user.role === 0 && (
                <li className="nav-item">
                <Link style={currentTab(history, "/user/dashboard")} className="nav-link" to="/user/dashboard">
                    U Dashboard
                </Link>
            </li>
            )}
            {isAuthenticated() && isAuthenticated().user.role === 1 && (
                            <li className="nav-item">
                            <Link style={currentTab(history, "/admin/dashboard")} className="nav-link" to="/admin/dashboard">
                                A Dashboard
                            </Link>
                        </li>
            )}

            {/*When the user is not authenticated show them Signup and Signin */}
            {!isAuthenticated() && (
                <Fragment>
                <li className="nav-item">
                    <Link style={currentTab(history, "/signup")} className="nav-link" to="/signup">
                        SignUp
                    </Link>
                </li>
                <li className="nav-item">
                    <Link style={currentTab(history, "/signin")} className="nav-link" to="/signin">
                        SignIn
                    </Link>
                </li>
                </Fragment>
            )}
            {/* isAuthenticated() can give true or false, and the component is always true
           //if isAuthenticated() is true, then T && T, and this ll execute, else F && T and it ll not execute */}
            {isAuthenticated() && (<li className="nav-item">
                {/*we can directly use onclick=signout(), but signout also further call a callback, we can signout and
                as well as redirect the user to homepage */}
                <span className="nav-link text-warning" onClick={()=>{
                    signout(()=>{
                        history.push("/")
                    })
                }}>
                    SignOut
                </span>
            </li>
            )}
        </ul>
    </div>
)

//Now its compatible, it gonna pickup all the routes using the link from the file Routes.js
export default withRouter(Menu)
