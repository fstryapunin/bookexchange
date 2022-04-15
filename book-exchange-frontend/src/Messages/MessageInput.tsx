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
    cursor: pointer;
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

interface IProps {
    handleSend: (arg1: any) => void
}

const MessageInput: React.FC<IProps> = ({ handleSend }) => {
    const [message, updateMessage] = useState('') 

    const handleKeypress = (event: React.KeyboardEvent<HTMLInputElement>) => {        
        if (event.key === "Enter") {            
            handleSendClick()
        }
    }    

    const handleMessageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length < 500) {
            updateMessage(event.target.value)
        }
    }

    const handleSendClick = () => {
        if ((message.trim()).length > 0) {            
            handleSend(message.trim())  
            updateMessage('')
        }
    }

    return (
        <>
            <StyledFiller>
                <StyledMessageInput />
                <StyledSendIcon/>
            </StyledFiller>
            <InputContainer>
                <StyledMessageInput value={message} onChange={handleMessageInput} onKeyPress={handleKeypress}/>
            <StyledSendIcon onClick={handleSendClick}/>
            </InputContainer>
        </>
        
    )
}

export default MessageInput