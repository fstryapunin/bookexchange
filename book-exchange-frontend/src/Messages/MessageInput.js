import React, { useState } from "react";
import styled from "styled-components";
import { Send } from '@styled-icons/boxicons-solid/Send'

const InputContainer = styled.div` 
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 25px;
    background: white;
    display: flex;
    gap: 10px;
`
const StyledSendIcon = styled(Send)` 
    fill: var(--dark-blue);
    height: 2.5rem;
`

const StyledMessageInput = styled.input` 
    flex-grow: 1;
    padding: 10px;
    border-radius: 5px;
    border: var(--medium-gray);
    background-color: var(--light-gray);
    
`
const StyledFiller = styled.div`
    visibility: none;
    padding-top: 25px;
    > * {
        visibility: none;
    }
` 

const MessageInput = ({ handleSend }) => {
    const [message, updateMessage] = useState('') 

    return (
        <>
            <StyledFiller>
                <StyledMessageInput />
                <StyledSendIcon/>
            </StyledFiller>
            <InputContainer>
            <StyledMessageInput />
            <StyledSendIcon/>
            </InputContainer>
        </>
        
    )
}

export default MessageInput