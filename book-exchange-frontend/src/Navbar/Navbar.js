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

const Navbar = ({ user, onLogin, onLogout }) => {
    
   
    return (
      
        <StyledNavbar>            
            <GoogleAuth user={user} onLogin={onLogin} onLogout={onLogout}/>
        </StyledNavbar>
      
    )
}

export default Navbar