import React from "react";
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { apiAdress } from "./Variables";

const clientId = '1028693232863-ahvojojs4rkgl1qv1op7q5010mk6hilk.apps.googleusercontent.com'

const GoogleAuth = () => {

    const onLoginSuccess = (res) => {
        console.log('Login response')
        console.log(res)
        fetch(`${apiAdress}/auth/google/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'                
            },
            body: JSON.stringify(
                {
                    token: res.tokenId
                }
            )
        })
    }

    const onLoginFailure = (res) => {
        console.log('Login response')
        console.log(res)
    }

    const onLogoutSuccess = () => {
        console.log('Logout success')        
    }

    return (
        <div>
            <h1>Hello world</h1>
            <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onLoginSuccess}
                onFailure={onLoginFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onLogoutSuccess}
            />
        </div>
    )
}

export default GoogleAuth