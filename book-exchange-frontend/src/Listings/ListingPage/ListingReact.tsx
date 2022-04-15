import React, {useState} from "react";
import { PrimaryButton } from "../../Styles/GlobalStyles";
import { useAppSelector, useAppDispatch } from "../../Hooks/hooks";
import styled from "styled-components";
import { Send } from '@styled-icons/boxicons-solid/Send'

const StyledSendIcon = styled(Send)` 
    fill: var(--dark-blue);
    height: 2.5rem;
    cursor: pointer;
`

const StyledMessageButton = styled(PrimaryButton)`
   padding: 10px;  
   margin: 0px;  
   margin-left: auto;
`
const StyledMessageInput = styled.input` 
    flex-grow: 1;
    padding: 10px;
    border-radius: 5px;
    border: var(--medium-gray);
    background-color: var(--light-gray);
    
`

const StyledInputContainer = styled.div` 
    box-sizing: border-box;    
    width: 100%;    
    display: flex;
    gap: 10px;
    margin-top: 20px;
`

interface IProps {
    data: Listing
}

const ListingReact: React.FC<IProps> = ({ data }) => {
    const [displaySend, updateSend] = useState(false)
    const [messageInput, updateMessageInput] = useState('')
    const [placeholderText, updatePlaceholder] = useState('Napiš zprávu...')
    const dispatch = useAppDispatch()
    const userId = useAppSelector(state => state.user.info.data?.id)

    const sendMessage = () => {        
        const messageData = {
            from: userId,            
            text: messageInput,
            to: data.user?.id,
            embedded: data.id
        }        

        dispatch({
            type: 'SEND_WEBSOCKET_MESSAGE',
            payload: messageData
        })

        updateSend(false)
        updateMessageInput('')
    } 

    const handleSendClick = () => {
        if ((messageInput.trim()).length > 0) {
            sendMessage()
        } else {
            updatePlaceholder('Alespoň pozdrav !!!')
        }
    }


    return (
        <>
            {!displaySend && userId ? <StyledMessageButton onClick={() => updateSend(true)}>REAGOVAT</StyledMessageButton> : null}
            {displaySend ?
                <StyledInputContainer>
                    <StyledMessageInput value={messageInput} placeholder={placeholderText} onChange={(event) => updateMessageInput(event.target.value)} />
                    <StyledSendIcon onClick={handleSendClick}/>
                </StyledInputContainer>
                : null}
        </>
    )
}

export default ListingReact