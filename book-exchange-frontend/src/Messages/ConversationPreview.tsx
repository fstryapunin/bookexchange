import React from "react";
import styled from "styled-components";

const StyledConversationContainer = styled.div` 
    display: flex;
    gap: 10px;    
    height: min-content ;
    cursor: pointer;   
    flex-shrink: 0;

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
    overflow: hidden;
`

const StyledUserName = styled.h6` 
    margin: 0;    
    white-space: nowrap;
`

interface STMessage {
    unread: boolean | null | undefined
}

const StyledLastMessage = styled.p<STMessage>` 
    margin: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: ${props => props.unread ? 'var(--dark-blue)' : 'inherit'};
    font-weight: ${props => props.unread ? 'bold' : 'inherit'};
`

interface IProps {
    user: User,
    onClick: (arg1: any) => void,
    data: Conversation
}

const ConversationPreview: React.FC<IProps> = ({ data, user, onClick }) => {    

    const otherUser = data.users.find(other => user.id !== other.id)
    
    const getLastMessage = () => {
        const last = data.messages.reduce((prev, current) => {
            if (prev.added < current.added) {
                   return current
            } else {
                return prev
            }
        })
        
        if (last.text.length > 15) {
            let trimmedString = last.text.substring(0, 15);
            trimmedString = trimmedString + '...'
           
            return trimmedString
            
        }

        return last.text
    }

    const hasUnreads =  () => {
        const has = data.messages.some(message => {
            if (message.seen === false && message.creator_id !== user.id) {            
                
                return true
            } else {
                return false
            }
        })        
        return has
    }

    return (
        <StyledConversationContainer onClick={() => onClick(data.id)}>
            <StyledUserImage src={otherUser?.img_link} referrerPolicy="no-referrer"/>
            <StyledUserContainer>               
                <StyledUserName>{otherUser?.first_name} {otherUser?.last_name}</StyledUserName>
                <StyledLastMessage unread={hasUnreads()}>{getLastMessage()}</StyledLastMessage>
            </StyledUserContainer>           
        </StyledConversationContainer>
    )
 }

export default ConversationPreview