import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { authenticateUserWithGoogle } from "../User/userSlice"
import styled from "styled-components";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

const GoogleButton = styled.div`
    display: ${props => props.$hidden ? 'none' : 'inline-block'};
    height: 25px;
    
`

const GoogleAuth = () => {
    const authStatus = useSelector(state => state.user.auth.status)
    const dispatch = useDispatch()

    const googleAccounts = () => {

        //save access token on login
        const onResponse = (props) => {
            dispatch(authenticateUserWithGoogle(props.credential))
        }

        //initialize google object and library if user doesn't have refresh token in cookie
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

    //render authetication button and show it if authenticated
    return (               
        <GoogleButton id="gbutton" $hidden={authStatus === 'unauthenticated' ? false : true}/>
    )    
}

export default GoogleAuth