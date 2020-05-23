import React from 'react'
//Since we are using nav bar everywhere, so its better we import it in the Base.js rather Home ..
import Menu from './Menu';

//if we have {} then we have to use return keyword, or else we can use () like below
//To make this reusable, we ll create variable
const Base = ({
    title = "My Title",
    description = "My Description",
    className = "bg-dark text-white p-4",
    //We are using Base component which is defined here in Home.js, as soon as we use children, this Base component will
    //act as an eclosing parent, now inside this whatever u pass as a children automatically get insereted here
    children
}) => (
    <div>
        <Menu/>
        <div className = "container-fluid">
            <div className = "jumbotron bg-dark text-white text-center">
                <h2 className = "display-4">{title}</h2>
                <p className = "lead">{description}</p>
            </div>
            <div className = {className}>{children}</div>
        </div>
        <footer className="footer bg-dark mt-auto py-3">
            <div className = "container-fluid bg-success text-white text-center py-3">
                <h4>If you got any question, feel free to reach out!</h4>
                <button className = "btn btn-warning btn-lg">Contact Us</button>
            </div>
            <div className = "container">
                <span className = "text-muted">
                    An Amazing <span className="text-white">MERN</span> Project
                </span>
            </div>
        </footer>
    </div>
)

export default Base;