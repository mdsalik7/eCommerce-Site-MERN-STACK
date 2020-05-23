import React from 'react'
import { API } from '../../backend'

//ImageHelper talks to the database and brings the image from it, ImageHelper is used in Card to show Image of the product
const ImageHelper = ({product}) => {
    //if there is an image in the product from the database then set that image to imageurl else use the image in the link(no image found.jpg)
    const imageurl = product ? `${API}/product/photo/${product._id}` : `https://images.pexels.com/photos/3561340/pexels-photo-3561340.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`
    return (
        <div className="rounded border border-success p-2">
            <img
              src={imageurl}    //src is imageurl
              alt="photo"
              style={{ maxHeight: "100%", maxWidth: "100%" }}
              className="mb-3 rounded"
            />
          </div>
    )
}

export default ImageHelper