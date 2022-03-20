import React from "react";
import styled from "styled-components";

const StyledConversationContainer = styled.div` 
    display: flex;
    gap: 10px;    
    height: min-content ;
    cursor: pointer;    
`
const StyledUserImage = styled.img` 
    height: 4rem;
    width: 4rem;
    border-radius: 50%;
`

const StyledUserContainer = styled.div` 
    display: flex;
    flex-direction: column;
    align-self: center;
`

const StyledUserName = styled.h6` 
    margin: 0;    
`

const StyledLastMessage = styled.p` 
    margin: 0;
    color: ${props => props.unread ? 'var(--dark-blue)' : 'inherit'};
    font-weight: ${props => props.unread ? 'bold' : 'inherit'};
`

const ConversationPreview = ({ data, user, onClick }) => {    

    const otherUser = data.users.find(other => user.id !== parseInt(other.id))
    
    const getLastMessage = () => {
        const last = data.messages.reduce((prev, current) => {
            if (prev.added < current.added) {
                   return current
            } else {
                return prev
            }
        })

        return last.text
    }

    const hasUnreads =  () => {
        const has = data.messages.some(message => {
            if (message.seen === false && parseInt(message.creator_id) !== user.id) {            
               
                return true
            } else {
                return false
            }
        })        
        return has
    }

    return (
        <StyledConversationContainer onClick={() => onClick(data.id)}>
            <StyledUserImage src={otherUser.img_link} referrerPolicy="no-referrer"/>
            <StyledUserContainer>               
                <StyledUserName>{otherUser.first_name} {otherUser.last_name}</StyledUserName>
                <StyledLastMessage unread={hasUnreads()}>{getLastMessage()}</StyledLastMessage>
            </StyledUserContainer>           
        </StyledConversationContainer>
    )
 }

export default ConversationPreview