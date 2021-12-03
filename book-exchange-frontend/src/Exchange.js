import React, {useEffect} from "react";
import Navbar from "./Navbar/Navbar";
import UserProfile from "./User/UserProfile";
import HomePage from "./Home/HomePage";
import { Routes, Route } from "react-router";
import { useSelector, useDispatch } from 'react-redux'
import { authenticateUser } from './State/authSlice'

const Exchange = () => {
    const authStatus = useSelector(state => state.auth.status)   
    const dispatch = useDispatch()    
    
    const onLoad = () => {
        if (authStatus === 'idle') {
            dispatch(authenticateUser())
        }
    }

    useEffect(onLoad, [authStatus, dispatch])          

    return (
        <>            
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="profil" element={<UserProfile/>} />
            </Routes>            
        </>
    )
    
}

export default Exchange