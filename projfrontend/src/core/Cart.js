import React, {useState, useEffect} from 'react'
import '../styles.css'
import {API} from "../backend"
import Base from './Base'
import Card from './Card'
import { loadCart } from './helper/cartHelper'
import Paymentb from './Paymentb'


const Cart = () => {
    const [products, setProducts] = useState([])
    const [reload, setReload] = useState(false) //state for reload component

    //method to load everything into the product
    useEffect(() => {
        //setProducts is reponsible for updating my state which internally runs a method loadcart
        setProducts(loadCart())
    }, [reload]) //reload the component
    //the square brackets in useEffect says at if any given point of time in the entire application things actuallly updates
    //and you forcefully update them then pass it on here


    //method to load products in cart
    const loadAllProducts = (products) => {
        return(
            <div>
            <h2>This section is to load products</h2>
            {products.map((product, index) => (
              <Card
                key={index}
                product={product}
                removeFromCart={true} //this ll allow to see remove from cart option (Condition Rendering in card.js)
                addtoCart={false} //this ll remove add to cart option (Condition Rendering in card.js)
                setReload={setReload}
                reload={reload}
              />
            ))}
          </div>
        )
    }

    const loadCheckout = () => {
        return(
            <div>
                <h2>This section is for Checkout</h2>
            </div>
        )
    }


    return (
        <Base title="Cart Page" description="Ready To Checkout"> {/* now title in Base.js is replaced by this title only for Home.js, this is reuse of components */}
            {/* <h1 className="text-white">Hello Frontend</h1>   This becomes children */}
            <div className = "row text-center">
                {/*If products length in cart is greater than 0 load all the products or else load the message*/}
                <div className="col-6">{products.length > 0 ? loadAllProducts(products) : (
                    <h3>No Products In Cart</h3>)}
                </div>
                {/*<div className="col-6">{loadCheckout()}</div>*/}
                {/*Lets go with payment braintree*/}
                <div className="col-6">
                    <Paymentb products={products} setReload={setReload}/>
                </div>
            </div>
        </Base>
    )
}

export default Cart