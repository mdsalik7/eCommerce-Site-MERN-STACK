import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {isAuthenticated} from './index'

//https://reacttraining.com/react-router/web/example/auth-workflow 
//We dont want to render multiple things we just want to render only one component, so children was replaced with component,
//we mention the property of component and say mount the Component
const PrivateRoute = ({ component : Component, ...rest }) => {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated() ? (
            <Component {...props}/>
          ) : (
            <Redirect
              to={{
                pathname: "/signin",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }

  export default PrivateRoute