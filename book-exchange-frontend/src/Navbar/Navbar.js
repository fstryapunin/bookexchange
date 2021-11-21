import React from "react";
import GoogleAuth from "../Auth/GoogleAuth";
import styled from 'styled-components'

const StyledNavbar = styled.div`
height: 74px;
padding: 20px;
box-sizing: border-box;
width: 100%;
display : flex;
justify-content: flex-end;
align-items: center;
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