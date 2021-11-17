import React from "react";
import { GoogleLogin, GoogleLogout } from 'react-google-login'

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID

const GoogleAuth = ({ isLogged, onLogin, onLogout }) => {  

    const onLoginSuccess = async (res) => {       
            onLogin(res.tokenId)       
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