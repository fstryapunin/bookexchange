import React from "react";
import MessageEmbed from "./MessageEmbed";
import styled from "styled-components";

interface SMProps {
    border?: string
    other?: any
}

const StyledMessageContainer = styled.div<SMProps>`     
    box-sizing: border-box;
    max-width: 70%;
    align-self: ${props => props.other ? 'flex-start' : 'flex-end'};
`


const StyledMessage = styled.div<SMProps>`    
    border-radius: ${props => props.border ? props.border: '15px'};
    border: ${props => props.other ? '2px solid var(--medium-gray)' : '2px solid var(--dark-blue)'};    
`
const StyledText = styled.p` 
    padding: 0.75rem;
    margin: 0;    
`

interface IProps {
    message: Message,
    other: boolean
}

const Message: React.FC<IProps> = ({ message, other }) => {
    const embeddedId = message.embedded

    if (!embeddedId) {
        return (
            <StyledMessageContainer key={message.id} other={other}>
                <StyledMessage other={other}>
                    <StyledText>{message.text}</StyledText>
                </StyledMessage>
            </StyledMessageContainer>
        )
    } else {
        return (
            <StyledMessageContainer key={message.id} other={other}>
                <MessageEmbed id={embeddedId}/>    
                <StyledMessage other={other}>                   
                    <StyledText>{message.text}</StyledText>
                </StyledMessage>
            </StyledMessageContainer>
        )
    }
    
}

export default Message