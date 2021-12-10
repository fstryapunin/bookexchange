import React from "react";
import GoogleAuth from "../Auth/GoogleAuth";
import NavLink from "./NavLink";
import { useSelector } from "react-redux";
import styled from 'styled-components'

const StyledNavbar = styled.div`
    padding: 25px;
    box-sizing: border-box;
    width: 100%;
    border-bottom: 5px solid var(--dark-blue);
    position: sticky;
    background-color: white;
`

const LinkContainer = styled.div`
    max-width: 1090px;  
    margin: 0 auto;
    display : flex;
    justify-content: space-between;
    align-items: center;
    display: flex;
    gap: 25px;
    #static-links{
        display: flex;
        gap: 10px
    }    
`

const navLinks = [
    {
        target: '',
        text: 'DOMŮ'
    },
    {
        target: 'katalog',
        text: 'KATALOG'
    }   
]

const Navbar = () => {
    const authStatus = useSelector((state) => state.user.auth.status)
    
    const links = navLinks.map(linkObj => {
        return <NavLink key={linkObj.text} target={linkObj.target} text={linkObj.text}/>
    })
   
    return (
      
        <StyledNavbar>            
            <LinkContainer>
                <div id="static-links">
                {links}
                </div>
                {authStatus === 'authenticated' ? <NavLink target={'profil'} text={'MŮJ ÚČET'} /> : null}
                <GoogleAuth/>
            </LinkContainer>            
        </StyledNavbar>
      
    )
}

export default Navbar