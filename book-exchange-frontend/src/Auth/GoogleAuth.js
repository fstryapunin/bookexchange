import React from "react";
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { apiAdress } from "../Variables";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

const GoogleAuth = ({ isLogged, onLogin, onLogout }) => {  

    const onLoginSuccess = async (res) => {       
        const loginRes = await fetch(`${apiAdress}/auth/google/login`, {
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
        if (loginRes.ok) {
            const userData = await loginRes.json()
            onLogin(userData)           
        }
    }

    const onLoginFailure = (res) => {
        console.log('Login failure')
        console.log(res)
        
    }

    const onLogoutSuccess = () => {
        onLogout()       
    }

    return (
        <div>            
            {!isLogged ? <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onLoginSuccess}
                onFailure={onLoginFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
                :
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onLogoutSuccess}
            />}
        </div>
    )
}

export default GoogleAuth