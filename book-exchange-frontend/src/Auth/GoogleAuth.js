import React, { useEffect } from "react";
import LogoutButton from "./LogoutButton";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY
const apiAdress = process.env.REACT_APP_API_ADRESS

const GoogleAuth = ({ user, onLogin, onLogout }) => {
    

    const handleCredentialResponse = async (response) => {
        if (response.credential) {
            const loginRes = await fetch(`${apiAdress}/auth/google/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        token: response.credential
                    }
                )
            })
            if (loginRes.ok) {
                const tokenRes = await fetch(`${apiAdress}/getAccessToken`, {
                    method: 'GET',
                    credentials: 'include'
                })
                
                const resBody = await tokenRes.json()
                if (resBody.token) {
                    onLogin(resBody.token)
                }
            }
        }
    }

    const googleAccouns = () => {
        const initializeGoogleSignIn = () => {
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: handleCredentialResponse
            });
            window.google.accounts.id.renderButton(
                document.getElementById("gbutton"),
                { theme: "outline", size: "medium" }
            )
        }


        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.onload = initializeGoogleSignIn()
        document.body.appendChild(script)
       
    }
    
    useEffect(googleAccouns, [])
    
    return (
        <div>
            {user.isLogged? <LogoutButton/> : null}
            <div id="gbutton" className={user.loaded && !user.isLogged ? null : 'gbutton-hidden'}></div>
        </div>
        
    )
        
    
}

export default GoogleAuth