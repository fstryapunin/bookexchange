import React, {useEffect} from "react";
import LogoutButton from "./LogoutButton";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
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

    const googleAccounts = () => {    
        if (user.loaded && !user.isLogged) {
            
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: handleCredentialResponse
            })
            window.google.accounts.id.renderButton(
                document.getElementById("gbutton"),
                { size: "medium" }
            )  
        }       
    }

    
    useEffect(googleAccounts, [user])
    
    return (
        <div>
            {user.isLogged ? <LogoutButton onLogout={onLogout}/> : null}
            <div id="gbutton" className={user.isLogged? 'visibility-none' : null}></div>
        </div>
        
    )
        
    
}

export default GoogleAuth