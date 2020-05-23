import React, {useState, useEffect} from 'react'
import Base from '../core/Base'
import { Link } from 'react-router-dom'
import { getCategories, getProduct, updateProduct } from './helper/adminapicall'
import { isAuthenticated } from '../auth/helper'

//same as AddProduct.js just with few changes
//whenever we need to take anything from the url in the react itself there is a proper method we have to follow,
//and that one thing to extract things from url is match but its actually a good idea to destructure it ryt here
const UpdateProduct = ({match}) => {

  const {user, token} = isAuthenticated()

  const [values, setValues] = useState({
    name : "",
    description : "",
    price : "",
    stock : "",
    photo : "",
    categories : [],
    category : "",
    loading : false,
    error : "",
    createdProduct : "",
    getaRedirect : false,
    formData : "" //Object of form data, so all of these information can be submitted to the backend
    })

  const {name, description, price, stock, categories, category, loading, error, createdProduct, getaRedirect, formData} = values

  const preload = (productId) => {
    //getProduct from adminapicalls requires productId which needs to be passed on
    getProduct(productId).then(data => {
      if(data.error){
        setValues({...values, error : data.error})
      } else {
        //load the categories for update
        preloadCategories()
        setValues({
            //since we are updating the values so in the form its not gonna be empty we ll be setting up the values
            //that we load up from the database
            ...values,
            //name is gonna be data.name which is gonna come from the backend
            name : data.name,
            description : data.description,
            price : data.price,
            category : data.category._id,
            stock : data.stock,
            //form prepared to setup things
            formData : new FormData()
        })
        
      }
    })
  }

  const preloadCategories = () => {
      getCategories().then(data => {
          if(data.error){
              setValues({...values, error : data.error})
          } else {
              setValues({
                  //populate the categories with the data
                  categories : data,
                  //initialize the form data, otherwise it would not pupulate inside your form but ll be there in the state
                  formData : new FormData()
              })
          }
      })
  }

  //syntax for useEffect
  useEffect(() => {
      //as preload above fires productId, so while calling this preload we can call this match and match has lot of 
      //things we can extract and one of them is params
    preload(match.params.productId)
  }, [])


  const onSubmit = (event) => {
    event.preventDefault()
    setValues({...values, error : "", loading : true})
    updateProduct(match.params.productId, user._id, token, formData)
    .then(data => {
      if(data.error){
        setValues({...values, error : data.error})
      } else {
        setValues({
          ...values,
          name : "",
          description : "",
          price : "",
          photo : "",
          stock : "",
          loading : false,
          createdProduct : data.name //createdProduct is just to get a popup that product is created successfully

        })
      }
    })
  }

  const handleChange = name => event => {
    //if value isequal to name which is equal to the photo that we are creating then do event.target.file, 
    //file comes with properties like jpeg size and all .. [0] means the path of the file so i can load up here
    const value = name === "photo" ? event.target.files[0] : event.target.value
    formData.set(name, value)
    setValues({...values, [name] : value})
  }

  const successMessage = () => (
    <div className="alert alert-success mt-3" style={{display : createdProduct ? "" : "none"}}>
      <h4>{createdProduct} Updated successfully</h4>
    </div>
  )

  //errorMessage



  //getaRedirect




    //downloaded from 16.5
  const createProductForm = () => (
    <form >
          <span>Post photo</span>
          <div className="form-group">
            <label className="btn btn-block btn-success">
              <input
                onChange={handleChange("photo")}
                type="file"
                name="photo"
                accept="image"
                placeholder="choose a file"
              />
            </label>
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("name")}
              name="photo"
              className="form-control"
              placeholder="Name"
              value={name}
            />
          </div>
          <div className="form-group">
            <textarea
              onChange={handleChange("description")}
              name="photo"
              className="form-control"
              placeholder="Description"
              value={description}
            />
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("price")}
              type="number"
              className="form-control"
              placeholder="Price"
              value={price}
            />
          </div>
          <div className="form-group">
            <select
              onChange={handleChange("category")}
              className="form-control"
              placeholder="Category"
            >
              <option>Select</option>
              {categories &&
              categories.map((cate, index) => (
              <option key={index} value={cate._id}>{cate.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("stock")}
              type="number"
              className="form-control"
              placeholder="Stock"
              value={stock}
            />
          </div>
          
          <button type="submit" onClick={onSubmit} className="btn btn-outline-success mb-3">
            Update Product
          </button>
        </form>
  );






  return (
    <Base title="Add a Product Here" 
    description="Welcome To Product Creation Section"
    className="container bg-info p-4">
      <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3">Admin Home</Link>
        <div className="row bg-dark text-white rounded">
          <div className="col-md-8 offset-md-2">
            {successMessage()}
            {createProductForm()}
          </div>
        </div>
    </Base>
  )
}

export default UpdateProduct