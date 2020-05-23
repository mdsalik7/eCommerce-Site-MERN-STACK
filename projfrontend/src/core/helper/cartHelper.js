//addItemToCart will store the user's cart information to the local storage
//big website store this information to there storage and servers as well

//providing item(product) so all the information carries along like product name, description, price, once that is
//being added to the local storage we are redirecting the page to cart page so we need a callback and whenever 
//we need a callback we need a next, so whenever everythin is all done just hand it over to the next
export const addItemToCart = (item, next) => {
    let cart = []
    //if we have an access of window object
    if(typeof window !== undefined){
        //if we have access to local storage's a particular item cart, if there is an existing cart then give me that
        if(localStorage.getItem("cart")) {
            //push that cart into a temporary cart
            cart = JSON.parse(localStorage.getItem("cart"))
        }
        //push all of this cart into original cart, above one is just a temporary one
        cart.push({
            //just load all the item and push this one here
            ...item,
            count: 1 //count will be 1 when we ll have it in the cart
        })
        localStorage.setItem("cart", JSON.stringify(cart))
        next();
    }
}

export const loadCart = () => {
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")){
            return JSON.parse(localStorage.getItem("cart"))
        }
    }
}


export const removeItemFromCart = (productId) => {
    let cart = []
    if(typeof window !== undefined){
        if(localStorage.getItem("cart")) {
            cart = JSON.parse(localStorage.getItem("cart"))
        }
        //while loopin in the cart we get a product and index
        cart.map((product, index) => {
            //if the product._id is equal to productId which is given to us while calling the method i.e when we hit the remove from cart button
            if(product._id === productId){
                //then remove it using splice, splice takes index and no. of item to remove
                cart.splice(index, 1)
            }
        })
        //then update the cart
        localStorage.setItem("cart", JSON.stringify(cart))
    }
    //return to cart
    return cart
}

//method for emptying the cart after checkout
//we need a callback so next is used
export const cartEmpty = next => {
    if(typeof window !== undefined){
        localStorage.removeItem("cart")
        let cart = []
        localStorage.setItem("cart", JSON.stringify(cart))
        next()
    }
}