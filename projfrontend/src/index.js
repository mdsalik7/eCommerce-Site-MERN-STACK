import React from 'react'
//importing Routes from same directory
import Routes from "./Routes"
//Using ReactDOM we can render any element
import ReactDOM from "react-dom"

//Rendering - Component to render Routes, Where we want render document.getElementById and the Id we are looking up for is
//root, this root exist in public folder in index.html
ReactDOM.render(<Routes/>, document.getElementById("root"))


