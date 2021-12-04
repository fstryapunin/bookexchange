import React from "react";
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import styled from "styled-components";

const StyledLink = styled(Link)`
    text-decoration: none;
    color: ${props => props.$active === true ? 'var(--dark-blue)' : 'var(--dark-gray)'};
    font-weight: 600;
    font-size: 20px;
`

const NavLink = ({ target, text }) => {
    const resolved = useResolvedPath(target)
    const match = useMatch({ path: resolved.pathname, end: true });    
    
    return (
        <StyledLink to={`/${target}`} $active={match? true : false}>{text}</StyledLink>
    )
}

export default NavLink