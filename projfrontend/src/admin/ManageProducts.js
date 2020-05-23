import React, {useState, useEffect} from 'react'
import Base from '../core/Base'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth/helper'
import { getProducts, deleteProduct } from './helper/adminapicall'

const ManageProducts = () => {
    const [products, setProducts] = useState([])
    const {user, token} = isAuthenticated()


    //preload the products, we ll preload them into products and as soon as webiste loads up or this component 
    //loads up we are going to show that
    const preload = () => {
      //getProducts from adminapicalls, then() gives us a data, then we performed conditional check on data
        getProducts().then(data => {
            if(data.error){
                console.log(data.error)
            } else {
              //setProducts() given to us by userState, we can load all the existing things but these are not 
              //object its just array so we simply store that
                setProducts(data)
            }
        })
    }

    //these preload needs to be called up first before even the component mount so we can use useEffect
    useEffect(() => {
        preload();
    }, [])

    const deleteThisProduct = productId => {
      //deleteProduct from adminapicalls
      deleteProduct(productId, user._id, token).then(data => {
        if(data.error){
          console.log(data.error)
        } else {
          //user ll not see be able to see that the product is deleted until we reload the component so preload()
          preload()
        }
      })
    }

//16.9 - basic web template
    return (
        <Base title="Welcome admin" description="Manage products here">
        <h2 className="mb-4">All products:</h2>
        <Link className="btn btn-info" to={`/admin/dashboard`}>
          <span className="">Admin Home</span>
        </Link>
        <div className="row">
          <div className="col-12">
            <h2 className="text-center text-white my-3">Total 3 products</h2>
            {/*looping through all the elements(product) in products, we ll get a product and an index*/}
            {products.map((product, index) => {
              return(
                            //We have to mention key as index, inorder to make sure we are not looping through the 
                            //same object we are looping through everytime with a different object in the map()
                            <div key={index} className="row text-center mb-2 ">
                            <div className="col-4">
                              <h3 className="text-white text-left">{product.name}</h3>
                            </div>
                            <div className="col-4">
                              <Link
                                className="btn btn-success"
                                to={`/admin/product/update/${product._id}`}
                              >
                                <span className="">Update</span>
                              </Link>
                            </div>
                            <div className="col-4">
                              {/*since we are passing product._id in deleteThisProduct(), so we have to use this way
                              else we could have directly called deleteThisProduct()*/}
                              <button onClick={() => {deleteThisProduct(product._id)}} className="btn btn-danger">
                                Delete
                              </button>
                            </div>
                            </div>
                    )
            })}
          </div>
        </div>
      </Base>
    )
}


export default ManageProducts