//importing react
import React from 'react'
//importing BrowserRouter, Switch, Route from react-router-dom so to connect backend to frontend
//Every routing will be handled by react-router-dom
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Home from './core/Home'
import Signup from './user/Signup'
import Signin from './user/Signin'
import AdminRoute from './auth/helper/AdminRoutes'
import PrivateRoute from './auth/helper/PrivateRoutes'
import UserDashBoard from './user/UserDashBoard'
import AdminDashBoard from './user/AdminDashBoard'
import AddCategory from './admin/AddCategory'
import ManageCategories from './admin/ManageCategories'
import AddProduct from './admin/AddProduct'
import ManageProducts from './admin/ManageProducts'
import UpdateProduct from './admin/UpdateProduct'
import Cart from './core/Cart'


const Routes = () => {
    //instead of returning div we are returning BrowserRouter component
    return (
        //Inside BrowserRouter we create multiple routes
        <BrowserRouter>
        {/*Switch is to serve a default route if the given route by the user doesnt match with the defined routes */}
            <Switch>
                {/*Route has path the user want to visit and what component should be loaded when someone visits the path,
                the components should be imported above first; 
                exact keyword is for loading the exact component, if exact keyword is not given the results ll append*/}
                <Route path="/" exact component={Home} />
                <Route path="/signup" exact component={Signup} />
                <Route path="/signin" exact component={Signin} />
                <Route path="/cart" exact component={Cart} />
                <PrivateRoute path="/user/dashboard" exact component={UserDashBoard} />
                <AdminRoute path="/admin/dashboard" exact component={AdminDashBoard}/>
                <AdminRoute path="/admin/create/category" exact component={AddCategory}/>
                <AdminRoute path="/admin/categories" exact component={ManageCategories}/>
                <AdminRoute path="/admin/create/product" exact component={AddProduct}/>
                <AdminRoute path="/admin/products" exact component={ManageProducts}/>
                <AdminRoute path="/admin/product/update/:productId" exact component={UpdateProduct}/>





            </Switch>
        </BrowserRouter>
    )
}

export default Routes