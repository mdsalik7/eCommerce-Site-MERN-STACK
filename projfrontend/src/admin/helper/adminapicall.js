import { API } from "../../backend";


//create a category
export const createCategory = (userId, token, category) => {
    return fetch(`${API}/category/create/${userId}`, {
        method : "POST",
        headers : {
            Accept : "application/json",
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
        },
        body : JSON.stringify(category)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

//get all categories
//getting all the categories and showing them in the frontend
//this can be also used on manage categories to get all the categories
export const getCategories = () => {
    return fetch(`${API}/categories`, {
        method : "GET"
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}


//create a product
export const createaProduct = (userId, token, product) => {
    return fetch(`${API}/product/create/${userId}`, {
        method : "POST",
        headers : {
            Accept : "application/json",
            Authorization : `Bearer ${token}`
        },
        body : product
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

//get all products
export const getProducts = () => {
    return fetch(`${API}/products`, {
        method : "GET"
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

//delete a product
export const deleteProduct = (productId, userId, token) => {
    return fetch(`${API}/product/${productId}/${userId}`, {
        method : "DELETE",
        headers : {
            Accept : "application/json",
            Authorization : `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}


//get a product
export const getProduct = productId => {
    return fetch(`${API}/product/${productId}`, {
        method : "GET"
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

//update a product
export const updateProduct = (productId, userId, token, product) => {
    //productId since we are updating a product, userId, token is for validation and product is the new information that is coming up
    return fetch(`${API}/product/${productId}/${userId}`, {
        method : "PUT",
        headers : {
            Accept : "application/json",
            Authorization : `Bearer ${token}`
        },
        body : product //product is the new updated information which is going to replace productId handled by our backend
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}