import React, {useState, useEffect} from "react";
import Navbar from "./Navbar/Navbar";
import UserProfile from "./User/UserProfile";
import HomePage from "./Home/HomePage";
import { Routes, Route, useNavigate } from "react-router";
const apiAdress = process.env.REACT_APP_API_ADRESS

const Exchange = () => {
    const [user, updateUser] = useState({     
        isLogged: false,   
        loaded: false
    })    
   
    const navigate = useNavigate()
    
    const onLoad = async () => {
        const tokenRes =  await fetch(`${apiAdress}/getAccessToken`, {
            method: 'GET',
            credentials: 'include'
        })
        if (tokenRes.ok) {
            const resBody = await tokenRes.json()
            updateUser({
                isLogged: true,
                loaded: true,
                token: resBody.token
            })
        } else if (tokenRes.status === 401) {
            //navigate to token expired error page here
            updateUser({
                isLogged: false,
                loaded: true                
            })
        } else {
            updateUser({
                isLogged: false,
                loaded: true                
            })
        }
    }

    useEffect(() => onLoad(), [])

    const onLogin = async (accessToken) => {
       
        updateUser({
            isLogged: true,
            token: accessToken
        })
    }

    const onLogout = async () => {
        const logoutRes =  await fetch(`${apiAdress}/auth/logout`, {
            method: 'GET',
            credentials: 'include'
        })
        if (logoutRes.ok) {
            updateUser({
                isLogged: false,
                loaded: true
            })
            navigate('/')
        }       
    }

    

    return (
        <>
            <Navbar user={user} onLogin={onLogin} onLogout={onLogout} />            
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="profil" element={<UserProfile user={user} />} />
            </Routes>            
        </>
    )
    
}

export default Exchange