import React from "react";
import GoogleAuth from "../Auth/GoogleAuth";
import styled from 'styled-components'
const apiAdress = process.env.REACT_APP_API_ADRESS

const StyledNavbar = styled.div`
padding: 20px;
box-sizing: border-box;
width: 100%;
display : flex;
justify-content: flex-end;
border-bottom: 2px solid var(--dark-blue);
position: sticky;
`

const Navbar = ({ onLogin, onLogout }) => {
    
    const makeTestReq = async () => {
        const res = await fetch(`${apiAdress}/test`, {
            method: 'GET',
            credentials: 'include'
        })  
    }

    return (
      
        <StyledNavbar>
            <button onClick={makeTestReq}>Test</button>
            <GoogleAuth onLogin={onLogin} onLogout={onLogout}/>
        </StyledNavbar>
      
    )
}

export default Navbar