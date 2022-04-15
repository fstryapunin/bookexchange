import React, { useState } from "react";
import useCheckMobileScreen from "../Hooks/useCheckMobile";
import { Card } from '../Styles/GlobalStyles'
import Conversation from "./Conversation";
import { useAppSelector } from "../Hooks/hooks";
import Loader from "../Loader/Loader";
import {ErrorGrowingCard} from '../Info/ErrorCard'
import ConversationPreview from "./ConversationPreview";
import styled from "styled-components";

const StyledPreviewContainer = styled(Card)`       
    position: relative;  
    display: flex;
    flex-direction: column;
    gap: 20px;  
    height: min-content;   
    flex-grow: 1; 
`

const StyledMessagePage = styled.div`    
    box-sizing: border-box;
    max-width: 1140px;    
    margin-left: auto;
    margin-right: auto;
    padding: 25px;
    display: flex;  
    gap: 20px;       
    min-height: calc(100vh - 1.5rem - 50px - 15px);
    max-height: calc(100vh - 1.5rem - 50px - 15px);

`

const MessagePage: React.FC = () => {
    const [currentConversationId, updateCurrent] = useState<string | number | null>(null)
    const conversations = useAppSelector(state => state.messages.data)
    const conversationsStatus = useAppSelector(state => state.messages.status)
    const userData = useAppSelector(state => state.user.info.data)    
    const isMobile = useCheckMobileScreen()

    const getPreviewElements = () => {
        if (userData) {
            const elements = conversations.map(conversation => <ConversationPreview key={conversation.id} data={conversation} user={userData} onClick={handlePreviewClick}/>)
            return elements
        }
       
    }

    const handlePreviewClick = (id: string | number) => {
        updateCurrent(id)
    }

    const getCurrentConversation = () => {
        if (!currentConversationId) return conversations[0]
        else {
            const conversation = conversations.find(conversation => conversation.id === currentConversationId)!
            return conversation
        }
    }

    if (conversationsStatus === "loaded" && conversations.length > 0 && userData) {
        if (!isMobile) {
            return (
                <StyledMessagePage>
                    <StyledPreviewContainer>
                        {getPreviewElements()}
                    </StyledPreviewContainer>
                    <Conversation data={getCurrentConversation()} user={userData} />
                </StyledMessagePage>
            )
        } else {
            if (!currentConversationId) {
                return (
                    <StyledMessagePage>
                    <StyledPreviewContainer>
                        {getPreviewElements()}
                    </StyledPreviewContainer>                   
                    </StyledMessagePage>
                )
            } else {
                return (
                    <StyledMessagePage>                        
                        <Conversation data={getCurrentConversation()} user={userData} mobile={true} reset={() => updateCurrent(null)}/>
                    </StyledMessagePage>
                ) 
            }
        }
    } else if(conversationsStatus === "loading") {
        return (
            <StyledMessagePage>
                <Loader/>
            </StyledMessagePage>
        )
    } else {
        return (
            <StyledMessagePage>
                <ErrorGrowingCard text="Bohužel zatím žádné zprávy"/>
            </StyledMessagePage>
        )
    }
}

export default MessagePage