import React, {useState} from 'react'
import Base from '../core/Base'
import { isAuthenticated } from '../auth/helper'
import { Link } from 'react-router-dom'
import { createCategory } from './helper/adminapicall'


const AddCategory = () => {
//setName, setError, .. is setter method to set the value in name, error, ..
    const [name, setName] = useState("")    //creating states, which ll be initially empty
    const [error, setError] = useState(false) //we also need success and error messages in the state which will be boolean, which ll be initially false
    const [success, setSuccess] = useState(false)

//extracting information(user, token) from isAuthenticated()
    const {user, token} = isAuthenticated();


    const goBack = () => (
        <div className="mt-5">
          <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">
            Admin Home
          </Link>
        </div>
      );

    const handleChange = event => {
      //we dont directly interact with the values name, error, success, we always use setName, setError ..
      setError("") //empty out the error there might be error from the last case
      setName(event.target.value) //value of the input, the value in the form will get into the state
    }

    const onSubmit = (event) => {
      event.preventDefault()
      setError("")
      setSuccess(false) //its now false when we get onSubmit then we ll set it as true

      //backend request fired
      createCategory(user._id, token, {name})
      .then(data => {
        if(data.error){
          setError(true)
        } else {
          setError("")
          setSuccess(true)
          setName("") //clean the field after success
        }
      })
    }

    const successMessage = () => {
      if(success) {
        return <h4 className="text-success">Category created successfully</h4>
      }
    }

    const warningMessage = () => {
      if(error) {
        return <h4 className="text-success">Failed to create Category</h4>
      }
    }



    const myCategoryForm = () => (
        <form>
          <div className="form-group">
            <p className="lead">Enter the Category</p>
            <input
              type="text"
              className="form-control my-3"
              onChange={handleChange}
              value={name}
              autoFocus
              required
              placeholder="For Ex. Summer"
            />
            <button onClick={onSubmit} className="btn btn-outline-info">Create Category</button>
          </div>
        </form>
      );


    return (
        <Base title="Create a Category Here" description="Add a New Category" className="container bg-info p-4">
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {myCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Base>
    )
}

export default AddCategory