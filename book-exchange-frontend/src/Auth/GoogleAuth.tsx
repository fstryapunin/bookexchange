import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../Hooks/hooks";
import { authenticateUserWithGoogle } from "../User/userSlice"
import styled from "styled-components";
import { CredentialResponse } from "google-one-tap";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

interface IButtonProps {
    $hidden: boolean
}

const GoogleButton = styled.div<IButtonProps>`
    display: ${props => props.$hidden ? 'none' : 'inline-block'};
    height: 25px;    
`

const GoogleAuth: React.FC = () => {
    const authStatus = useAppSelector(state => state.user.auth.status)
    const dispatch = useAppDispatch()

    const googleAccounts = () => {

        //save access token on login
        const onResponse = (props: CredentialResponse) => {           
            dispatch(authenticateUserWithGoogle(props.credential))
        }

        //initialize google object and library if user doesn't have refresh token in cookie
        if (authStatus === 'unauthenticated') {
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: onResponse
            })
            window.google.accounts.id.renderButton(
                document.getElementById("gbutton")!,
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