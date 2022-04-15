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
    justify-content: space-between;
`

const StyledSuccessHeading = styled(SectionHeading)`     
    white-space: nowrap;   
`
const StyledSuccesButton = styled(SecondaryButton)`    
    white-space: nowrap;
    min-width: 135px;
    margin: 0;
    flex-grow: 1;
    box-shadow: none;
`

const Success: React.FC = () => {
    return (
        <StyledContainer>
            <StyledSuccessHeading>Úspěšně přidáno!</StyledSuccessHeading>
            <StyledButtonContainer>
                <Link to="/"><StyledSuccesButton>Zpět na hlavní</StyledSuccesButton></Link>
                <Link to="/profil"><StyledSuccesButton>Zpět na profil</StyledSuccesButton></Link>
            </StyledButtonContainer>
        </StyledContainer>        
    )
}

export default Success