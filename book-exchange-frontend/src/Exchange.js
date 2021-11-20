import React, {useState, useEffect} from "react";
import Navbar from "./Navbar/Navbar";
import UserProfile from "./User/UserProfile";
import HomePage from "./Home/HomePage";
import { Routes, Route, useNavigate, Navigate  } from "react-router";

const Exchange = () => {
    const [user, updateUser] = useState({
        isLogged: false
    })

    
   
    const navigate = useNavigate()   

    const onLogin = async (tokenId) => {     
        
    }

    const onLogout = () => {
        updateUser({
            isLogged: false
        })
        navigate('/')
    }

    

    return (
        <>
            <Navbar onLogin={onLogin} onLogout={onLogout} />            
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="profil" element={user.isLogged ? <UserProfile userData={user} /> : <Navigate to='/'/>}/>
            </Routes>            
        </>
    )
}

export default Exchange