import React, {useEffect} from "react";
import Navbar from "./Navbar/Navbar";
import UserProfile from "./User/UserProfile";
import HomePage from "./Home/HomePage";
import Catalogue from "./Catalogue/Catalogue";
import ListingPage from "./Listings/ListingPage";
import ListingEditor from "./User/ListingEditor";
import RequireAuth from "./User/RequireAuth";
import ListingCreator from "./User/Creator/ListingCreator";
import Success from "./Info/Success";
import Error from "./Info/Error";
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
                <Route path="katalog" element={<Catalogue />} />
                <Route path="listing/:id" element={<ListingPage />} />
                <Route path="success" element={<Success />} />
                <Route path="error" element={<Error />}/>
                <Route element={<RequireAuth/>}>
                    <Route path="profil/editor/:id" element={<ListingEditor />} />
                    <Route path="profil" element={<UserProfile />} />
                    <Route path="profil/creator" element={<ListingCreator/>} />
                </Route>
            </Routes>            
        </>
    )    
}


export default Exchange