import React from "react";
import GoogleAuth from "../Auth/GoogleAuth";

const Navbar = ({ isLogged, onLogin, onLogout }) => {
    return (
        <div>
            <GoogleAuth isLogged={isLogged} onLogin={onLogin} onLogout={onLogout}/>
        </div>
    )
}

export default Navbar