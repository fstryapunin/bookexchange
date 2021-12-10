import React, {useEffect} from "react";
import Navbar from "./Navbar/Navbar";
import UserProfile from "./User/UserProfile";
import HomePage from "./Home/HomePage";
import Catalogue from "./Catalogue/Catalogue";
import ListingPage from "./Listings/ListingPage";
import { Routes, Route } from "react-router";
import { useSelector, useDispatch } from 'react-redux'
import { authenticateUser } from './User/userSlice'

const Exchange = () => {
    const authStatus = useSelector(state => state.user.auth.status)   
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
                <Route path="profil" element={<UserProfile />} />
                <Route path="katalog" element={<Catalogue />} />
                <Route path="listing/:id" element={<ListingPage/>}/>
            </Routes>            
        </>
    )
    
}

export default Exchange