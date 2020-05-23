import React, {useState, useEffect} from 'react'
import { loadCart, cartEmpty } from './helper/cartHelper'
import { Link } from 'react-router-dom'
import { getmeToken, processPayment } from './helper/paymentbhelper'
import { createOrder } from './helper/orderHelper'
import { isAuthenticated } from '../auth/helper'
import DropIn from 'braintree-web-drop-in-react'


const Paymentb = ({products, setReload = f => f, reload = undefined}) => {

    const [info, setInfo] = useState({
        loading : false,
        success : false,
        clientToken : null, //from the braintree-web-drop-in-react npm docx
        error : "",
        instance : {} //instance gets automatically filled with request
    })

    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token

    //getToken will fire up my custom method getmeToken
    const getToken = (userId, token) => {
        getmeToken(userId, token).then(info => {
            console.log("INFORMATION", info)
            if(info.error){
                setInfo({...info, error : info.error})
            }else{
                const clientToken = info.clientToken
                //update the state
                setInfo({clientToken}) //this means clientToken : clientToken, but we are using es6 so thats the syntax
            }
        })
    }

    //Web Drop In - Conditional rendering - if there is isAuthenticated() i.e the user is authenticated and the 
    //product length is greater than 0 i.e there are products then show this drop in
    const showbtdropIn = () => {
        return(
            <div>
                {info.clientToken !== null && products.length > 0 ? (
                    //from braintree-web-drop-in-react docx
                    <div>
                    <DropIn
                      options={{ authorization: info.clientToken }}
                      onInstance={(instance) => (info.instance = instance)}
                    />
                    <button className="btn btn-block btn-success" onClick={onPurchase}>Buy</button>
                  </div>
                ) : (
                <h3>
                    Please Login Or Add Something To Cart
                </h3>
                )}
            </div>
        )
    }

    useEffect(() => {
        getToken(userId, token)
    }, [])

    const onPurchase = () => {
        setInfo({loading : true})
        let nonce
        //This nonce is going to be come up from instance, this is that phase where our api talks to braintree and braintree
        //gets back to us with a nonce, this needs to be there while making a request and thats it, info.instance will get this nonce
        let getNonce = info.instance
        //from braintree docx
        .requestPaymentMethod() //method for requesting for payment which gives nonce and everything back in the data which is required for payment settlement 
        .then(data => {
            //extracting nonce from data
            nonce = data.nonce
            //collecting the payment data, payment data requires to process two things paymentMethodNonce which is going
            //to comeup from nonce and the amount to be charged
            const paymentData = {
                paymentMethodNonce : nonce,
                amount : getAmount()
            }
            processPayment(userId, token, paymentData)
            .then(response => {
                //Providing information into our state, load info and update the success as true (fill success with response.success) 
                //because we might want to show some message on the screen 
                setInfo({...info, success : response.success, loading : false})
                console.log("PAYMENT SUCCESS")
                const orderData = {
                    products : products,
                    transaction_id : response.transaction.id,
                    amount : response.transaction.amount
                    //Todo add address and status of delivery


                }

                createOrder(userId, token, orderData)


                //Empyting the cart after payment
                cartEmpty(() => {
                    console.log("Did we got a crash?")
                })
                //force reload
                setReload(!reload)
            })
            .catch(error => {
                setInfo({loading : false, success : false})
                console.log("PAYMENT FAILED")

            })
        })
    }

    //method to calculate amount to be charged
    const getAmount = () => {
        let amount = 0
        //looping through products will get us p(product)
        products.map(p => {
            //amount will be updated with amount + price of the product
            amount = amount + p.price
        })
        //returning the total or updated amount so it can be used in onPurchase()
        return amount
    }


    return (
        <div>
            <h3>Total Amount To Be Deducted : Rs. {getAmount()}</h3>
            {showbtdropIn()}
        </div>
    )
}

export default Paymentb