import React, {useState} from "react";
import Navbar from "./Navbar/Navbar";
import UserProfile from "./User/UserProfile";
import { Routes, Route } from "react-router";

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
        <>
            <Navbar isLogged={user.isLogged} onLogin={onLogin} onLogout={onLogout} />
            <Routes>
                <Route path="/" />
                <Route path="profil" />
            </Routes>            
        </>
    )
}

export default Exchange