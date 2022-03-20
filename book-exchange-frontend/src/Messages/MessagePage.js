import React, { useState, useEffect} from "react";
import { Card } from '../Styles/GlobalStyles'
import Conversation from "./Conversation";
import { useSelector } from 'react-redux'
import Loader from "../Loader/Loader";

import ConversationPreview from "./ConversationPreview";
import styled from "styled-components";

const StyledMessagesContainer = styled(Card)`       
    position: relative;  
    display: flex;
    flex-direction: column;
    gap: 20px;  
    height: min-content;
`
const StyledMessagePage = styled.div`
    width: 100%;
    box-sizing: border-box;
    max-width: 1140px;    
    margin-left: auto;
    margin-right: auto;
    padding: 25px;
    display: flex;
    gap: 20px;
`

const MessagePage = () => {
    const [currentConversationId, updateCurrent] = useState(null)
    const conversations = useSelector(state => state.messages.data)
    const conversationsStatus = useSelector(state => state.messages.status)
    const userData = useSelector(state => state.user.info.data)    

    const getPreviewElements = () => {
        const elements = conversations.map(conversation => <ConversationPreview key={conversation.id} data={conversation} user={userData} onClick={handlePreviewClick}/>)
        return elements
    }

    const handlePreviewClick = id => {
        updateCurrent(id)
    }

    const getCurrentConversation = () => {
        if (!currentConversationId) return conversations[0]
        else {
            const conversation = conversations.find(conversation => conversation.id === currentConversationId)
            return conversation
        }
    }

    if (conversationsStatus === "loaded") {
        return (
            <StyledMessagePage>
            
                <StyledMessagesContainer>                    
                    {getPreviewElements()}                   
                </StyledMessagesContainer>
                <Conversation data={getCurrentConversation()} user={userData} />
            </StyledMessagePage>
        )
    } else {
        return (
            <StyledMessagePage>
                <Loader/>
            </StyledMessagePage>
        )
    }
}

export default MessagePage