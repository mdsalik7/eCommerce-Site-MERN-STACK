import { API } from "../../backend";

//orderData is order information
export const createOrder = (userId, token, orderData) => {
    return fetch(`${API}/order/create/${userId}`, {
        method : "POST",
        headers : {
            Accept : "application/json",
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
        },
        //extracting order from orderData
        body : JSON.stringify({order : orderData})
    }).then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}