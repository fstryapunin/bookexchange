import React from "react";
import { GoogleLogin } from 'react-google-login'

const clientId = '1028693232863-ahvojojs4rkgl1qv1op7q5010mk6hilk.apps.googleusercontent.com'

const GoogleAuth = () => {

    const onLogin = (res) => {
        console.log('Login response')
        console.log(res)
    }

    return (
        <div>
            <h1>Hello world</h1>
            <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onLogin}
                onFailure={onLogin}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    )
}

export default GoogleAuth