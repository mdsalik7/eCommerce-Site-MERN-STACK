import { API } from "../../backend";

export const getmeToken = (userId, token) => {
    return fetch(`${API}/payment/gettoken/${userId}`, {
        method : "GET",
        headers : {
            Accept : "application/json",
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}

//paymentInfo is like what amount it is
export const processPayment = (userId, token, paymentInfo) => {
    return fetch(`${API}/payment/braintree/${userId}`, {
        method : "POST",
        headers : {
            Accept : "application/json",
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
        },
        //there is body because this payment information is in the body
        body : JSON.stringify(paymentInfo)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}