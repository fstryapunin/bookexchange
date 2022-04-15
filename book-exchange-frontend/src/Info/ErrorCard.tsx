import React from "react";
import { Card } from "../Styles/GlobalStyles";
import { SadEmojiLarge } from "../Styles/GlobalIcons";
import styled from "styled-components";

const StyledCard = styled(Card)` 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > h2 {
        color: var(--dark-blue);
        text-align: center;
    }
`

const StyledGrowing = styled(StyledCard)` 
    flex-grow: 1;
`

interface IProps {
    text: string
}

const ErrorCard: React.FC<IProps> = ({text}) => {
    return (
        <StyledCard>
            <SadEmojiLarge/>
            <h2>{text}</h2>
        </StyledCard>
    )
}

export const ErrorGrowingCard: React.FC<IProps> = ({text}) => {
    return (
        <StyledGrowing>
            <SadEmojiLarge/>
            <h2>{text}</h2>
        </StyledGrowing>
    )
}

export default ErrorCard