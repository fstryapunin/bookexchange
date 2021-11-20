import React, { useEffect } from "react";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY
const apiAdress = process.env.REACT_APP_API_ADRESS

const GoogleAuth = ({ onLogin, onLogout }) => {

    const handleCredentialResponse = async (response) => {
        if (response.credential) {
            const loginRes = await fetch(`${apiAdress}/auth/google/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'                
                },
                body: JSON.stringify(
                    {
                        token: response.credential
                    }
                )
            })            
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
                { theme: "outline", size: "large" } 
            )
        }


        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.onload = initializeGoogleSignIn()
        document.body.appendChild(script)
       
     }
    
    useEffect(googleAccouns, [])    

    return (
        <div id="gbutton"></div>
    )
}

export default GoogleAuth