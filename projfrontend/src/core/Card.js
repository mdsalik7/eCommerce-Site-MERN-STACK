import React, {useState, useEffect} from 'react'
import ImageHelper from './helper/ImageHelper';
import { Redirect } from 'react-router-dom';
import { addItemToCart, removeItemFromCart } from './helper/cartHelper';

const Card = ({
    product,
    //default property for addtoCart, removeFromCart
    addtoCart = true,
    removeFromCart = false,
     //setReload = function(f){return f} - Its an anonymous function which throws exactly what you give to it; just used other syntax
    setReload = f => f, //for reloadin the component after remove from cart
    reload = undefined

}) => {

    const [redirect, setRedirect] = useState(false) //initially its false as nothing is getting redirect automatically
    const [count, setCount] = useState(product.count) //introducing a new property in the product i.e count (used in cartHelper)


    //cartTitle is based on product, if there is a product present extract the name from product else use the given string
    const cartTitle = product ? product.name : "A Photo from Pexels"
    const cartDescription = product ? product.description : "Default Description"
    const cartPrice = product ? product.price : "Default Price"


    //method to add to cart
    const addToCart = () => {
        //calling addItemToCart() from cartHelper and setting setRedirect to true
        addItemToCart(product, () => setRedirect(true))
    }


    //method to redirect
    const getARedirect = (redirect) => {
        if(redirect){
            return <Redirect to="/cart" />
        }
    }


    //method to show add to cart 
    const showAddToCart = addtoCart => {
        return(
            //Conditional rendering(not to show add to cart option in the cart menu), addToCart is set to true and button is always true
            //by changing addToCart to false we ll be able to perform the conditional rendering(i.e addToCart wont show)
            addtoCart && (
                <button
                onClick={addToCart}
                className="btn btn-block btn-outline-success mt-2 mb-2"
              >
                 Add To Cart
              </button>
            )
        )

    }
    //method to show remove from cart
    const showRemoveFromCart = removeFromCart => {
        return(
            //Conditional rendering(not to show remove from cart option when the product is not in the cart), removeFromCart is set to false
            //By changing removeFromCart to true we ll be able to make this option displayed
            removeFromCart && (
            <button
                onClick={() => {
                  removeItemFromCart(product._id)
                  setReload(!reload) //it flips the reload if its true it takes false if its false it takes true
                }}
                className="btn btn-block btn-outline-danger mt-2 mb-2"
              >
                Remove From Cart
              </button>
            )
        )
    }


    //template from 17.1
    return (
      <div className="card text-white bg-dark border border-info ">
        <div className="card-header lead">{cartTitle}</div>
        <div className="card-body">
            {getARedirect(redirect)}
            <ImageHelper product={product}/> 
          <p className="lead bg-success font-weight-normal text-wrap">
            {cartDescription}
          </p>
    <p className="btn btn-success rounded  btn-sm px-4">Rs. {cartPrice}</p>
          <div className="row">
            <div className="col-12">
                {/*calling showAddToCart() while passing the property addTocart */}
              {showAddToCart(addtoCart)}
            </div>
            <div className="col-12">
                {showRemoveFromCart(removeFromCart)}
            </div>
          </div>
        </div>
      </div>
    );
};

export default Card