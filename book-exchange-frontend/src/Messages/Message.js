import React from "react";
import styled from "styled-components";

const StyledMessageContainer = styled.div` 
    display: flex;
    gap: 10px;
    box-sizing: border-box;
    max-width: 70%;
    align-self: ${props => props.other ? 'flex-start' : 'flex-end'};
`

const StyledMessage = styled.p` 
    margin: 0;
    padding: 0.75rem;
    border-radius: 10px;   
    border: ${props => props.other ? '2px solid var(--medium-gray)' : '2px solid var(--dark-blue)'};
    align-self: center;
`

const Message = ({ message, other }) => {
    
    return (
        <StyledMessageContainer key={message.id} other={other}>
            <StyledMessage other={other}>
                {message.text}
            </StyledMessage>                    
        </StyledMessageContainer>
    )
    
}

export default Message