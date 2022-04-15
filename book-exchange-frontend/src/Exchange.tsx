import React, {useEffect} from "react";
import Navbar from "./Navbar/Navbar";
import UserProfile from "./User/UserProfile";
import HomePage from "./Home/HomePage";
import ListingPage from "./Listings/ListingPage/ListingPage";
import RequireAuth from "./User/RequireAuth";
import RequireUser from "./User/RequireUser";
import ListingCreator from "./User/Creator/ListingCreator";
import MessagePage from './Messages/MessagePage'
import Success from "./Info/Success";
import Error from "./Info/Error";
import { Routes, Route } from "react-router";
import { useAppSelector, useAppDispatch } from "./Hooks/hooks";
import { authenticateUser } from './User/userSlice'
import { fetchUserData } from "./User/userSlice";
import { fetchConversations } from "./Messages/messagesSlice";
import styled from "styled-components";

const StyledAppContainter = styled.div` 
    min-height: 100%;
`

const Exchange: React.FC = () => {
    const authStatus = useAppSelector(state => state.user.auth.status) 
    const dispatch = useAppDispatch()    
    
    const onLoad = () => {
        if (authStatus === 'idle') {            
            dispatch(authenticateUser())
        } 
        if (authStatus === 'authenticated') {
            dispatch({
                type: 'AUTHORIZE_WEBSOCKET'                
            })
            dispatch(fetchConversations())
            dispatch(fetchUserData())
        }
    }    

    useEffect(onLoad, [authStatus, dispatch])          

    return (
        <StyledAppContainter>            
            <Navbar />           
            <Routes>
                <Route path='*' element={<Error />} />
                <Route path="/" element={<HomePage />} />                
                <Route path="listing/:id" element={<ListingPage />} />
                <Route path="success" element={<Success />} />
                <Route path="error" element={<Error />}/>
                <Route element={<RequireAuth />}>       
                    <Route element={<RequireUser />}> 
                        <Route path="profil" element={<UserProfile />} />
                        <Route path="zpravy" element={<MessagePage />} />
                    </Route>       
                    <Route path="profil/creator" element={<ListingCreator />} />                    
                </Route>
            </Routes>            
        </StyledAppContainter>
    )    
}


export default Exchange