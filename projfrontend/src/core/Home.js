import React, {useState, useEffect} from 'react'
//import css
import '../styles.css'
//importing API variable from backend.js
import {API} from "../backend"
//importing Base component
import Base from './Base'
//importing card component
import Card from './Card'
//importing getProducts
import { getProducts } from './helper/coreapicalls'


export default function Home() {

    const [products, setProducts] = useState([])
    const [error, setError] = useState(false) //initially the error is going to be false

    //method to load all products into the state and then ll iterate into the states using map
    const loadAllProduct = () => {
        //getProducts ll get all the products from the database
        getProducts().then(data => {
            if(data.error){
                setError(data.error)
            }else{
                setProducts(data)
            }
        })
    }
    
    //loadAllProduct ll not run automatically so we ll use useEffect to run it
    useEffect(() => {
        loadAllProduct()
    }, [])



    return (
        <Base title="Home Page" description="My Tshirt Store"> {/* now title in Base.js is replaced by this title only for Home.js, this is reuse of components */}
            {/* <h1 className="text-white">Hello Frontend</h1>   This becomes children */}
            <div className = "row text-center">
            <h1 className="text-white">ALL OF SHIRTS</h1>
                <div className="row">
                    {products.map((product, index) => {
                        return(
                            <div key={index} className="col-4 mb-4">
                                {/*Passing product as a property in the card */}
                                <Card product={product}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Base>
    )
}
