import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { authenticateUserWithGoogle } from "../State/authSlice";
import LogoutButton from "./LogoutButton";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

const GoogleAuth = () => {
    const authStatus = useSelector(state => state.auth.status)
    const dispatch = useDispatch()    

    const googleAccounts = () => {
        const onResponse = (props) => {
            dispatch(authenticateUserWithGoogle(props.credential))
        }

        if (authStatus === 'unauthenticated') {
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: onResponse
            })
            window.google.accounts.id.renderButton(
                document.getElementById("gbutton"),
                {
                    size: "medium",                    
                }
            )  
        }       
    }
    
    useEffect(googleAccounts, [authStatus, dispatch])
    
    return (
        <div>
            {authStatus === 'authenticated' ? <LogoutButton/> : null}
            <div id="gbutton" className={authStatus === 'unauthenticated' ? null : 'visibility-none' }></div>
        </div>
        
    )    
}

export default GoogleAuth