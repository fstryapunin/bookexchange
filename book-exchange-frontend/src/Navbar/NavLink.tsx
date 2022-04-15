import React from "react";
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import styled from "styled-components";

interface linkProps {
    $active: boolean
}

const StyledLink = styled(Link)<linkProps>`
    text-decoration: none;
    color: ${props => props.$active ? 'var(--dark-blue)' : 'var(--dark-gray)'};
    font-weight: 600;
    font-size: 1.5rem;
`

interface Props {
    target: string,
    text: string
}

const NavLink: React.FC<Props> = ({ target, text }) => {
    //check if path matches link
    const resolved = useResolvedPath(target)
    const match = useMatch({ path: resolved.pathname, end: true });    
    
    return (
        <StyledLink to={`/${target}`} $active={match? true : false}>{text}</StyledLink>
    )
}

export default NavLink