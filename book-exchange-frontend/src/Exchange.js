import React, {useState, useEffect} from "react";
import Navbar from "./Navbar/Navbar";
import UserProfile from "./User/UserProfile";
import HomePage from "./Home/HomePage";
import { Routes, Route, useNavigate, Navigate } from "react-router";

const Exchange = () => {
    const [user, updateUser] = useState({
        isLogged: false
    })
    const apiAdress = process.env.REACT_APP_API_ADRESS    
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
    const navigate = useNavigate()
   
    
    const callme = (res) => {
        console.log(res)
    }     
    
    const onLogin = async (tokenId) => {        
        const loginRes = await fetch(`${apiAdress}/auth/google/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'                
            },
            body: JSON.stringify(
                {
                    token: tokenId
                }
            )
        })
        if (loginRes.ok) {
            updateUser({isLogged: true})
        }
    }

    const onLogout = () => {
        updateUser({
            isLogged: false
        })
        navigate('/')
    }

    

    return (
        <>
            <Navbar isLogged={user.isLogged} onLogin={onLogin} onLogout={onLogout} />
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="profil" element={user.isLogged ? <UserProfile userData={user} /> : <Navigate to='/'/>}/>
            </Routes>            
        </>
    )
}

export default Exchange