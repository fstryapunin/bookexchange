import React from "react";
import GoogleAuth from "../Auth/GoogleAuth";
import styled from 'styled-components'

const StyledNavbar = styled.div`
padding: 20px;
box-sizing: border-box;
width: 100%;
display : flex;
justify-content: flex-end;
border-bottom: 2px solid var(--dark-blue);
`

const Navbar = ({ isLogged, onLogin, onLogout }) => {
    return (
      
        <StyledNavbar>
            <GoogleAuth isLogged={isLogged} onLogin={onLogin} onLogout={onLogout}/>
        </StyledNavbar>
      
    )
}

export default Navbar