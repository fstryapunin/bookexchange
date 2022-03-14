import React from 'react'
import { Card, SecondaryButton, SectionHeading } from '../Styles/GlobalStyles'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledContainer = styled(Card)` 
    position: absolute;
    top: 5%;
    right: 50%;
    transform: translate(50%, 50%);
`
const StyledButtonContainer = styled.div`  
    margin-top: 20px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`

const StyledErrorHeading = styled(SectionHeading)`     
    white-space: nowrap;   
`
const StyledErrorButton = styled(SecondaryButton)`    
    white-space: nowrap;
    min-width: 135px;
    margin: 0;
    flex-grow: 1;
    box-shadow: none;
`

const Error = () => {
    return (
        <StyledContainer>
            <StyledErrorHeading>Došlo k chybě!</StyledErrorHeading>
            <StyledButtonContainer>
                <Link to="/"><StyledErrorButton>Zpět na hlavní</StyledErrorButton></Link>
                <Link to="/profil"><StyledErrorButton>Zpět na profil</StyledErrorButton></Link>
            </StyledButtonContainer>
        </StyledContainer>        
    )
}

export default Error