import React, {useState} from "react";
import Navbar from "./Navbar/Navbar";
import {
    BrowserRouter as Router,
    Routes,
    Route
  } from "react-router-dom";
const Exchange = () => {
    const [user, updateUser] = useState({
        isLogged: false
    })

    const onLogin = (userData) => {
        const newUser = { ...user, isLogged: true, data: userData }
        updateUser(newUser)
    }

    const onLogout = () => {
        updateUser({
            isLogged: false
        })
    }

    return (
        <div>
            
            <Router>
                <Navbar isLogged={user.isLogged} onLogin={onLogin} onLogout={onLogout}/>
                <Routes>                    
                    <Route path='/profil' element={<h1>Profil</h1>} />                 
                </Routes>          
            </Router>           
        </div>
    )
}

export default Exchange