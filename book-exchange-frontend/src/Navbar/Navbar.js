import React from "react";
import GoogleAuth from "../Auth/GoogleAuth";
import NavLink from "./NavLink";
import styled from 'styled-components'

const StyledNavbar = styled.div`
height: 74px;
padding: 20px;
box-sizing: border-box;
width: 100%;
display : flex;
justify-content: flex-end;
align-items: center;
border-bottom: 5px solid var(--dark-blue);
position: sticky;
background-color: white;
`
const LinkContainer = styled.div`
    display: flex;
    gap: 20px;
    position: absolute;
    right: 50%;
    transform: translateX(50%);
`

const navLinks = [
    {
        target: '',
        text: 'DOMŮ'
    },
    {
        target: 'profil',
        text: 'PROFIL'
    }    
]

const Navbar = ({ user, onLogin, onLogout }) => {
    
    const links = navLinks.map(linkObj => {
        return <NavLink key={linkObj.text} target={linkObj.target} text={linkObj.text}/>
    })
   
    return (
      
        <StyledNavbar>
            <LinkContainer>
                {links}
            </LinkContainer>
            <GoogleAuth user={user} onLogin={onLogin} onLogout={onLogout}/>
        </StyledNavbar>
      
    )
}

export default Navbar