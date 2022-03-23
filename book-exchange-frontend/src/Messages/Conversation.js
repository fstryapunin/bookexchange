import React, {useEffect} from 'react'
import { Card } from '../Styles/GlobalStyles'
import { fetchReadConversation } from './messagesSlice'
import ConversationInfo from './ConversationInfo'
import { useDispatch } from 'react-redux'
import MessageInput from './MessageInput'
import Message from './Message'
import styled from 'styled-components'

const StyledConversationContainer = styled(Card)`
    flex-grow: 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;     
    position: relative;   
`

const StyledMessagesContainer = styled.div` 
    display: flex;
    flex-direction: column-reverse;
    flex-grow: 1;
    overflow-y: auto;
    gap: 10px;
`

const Conversation = ({ data, user }) => {  
    const dispatch = useDispatch()

    useEffect(() => {
        //if has any unreads dispatch seen update
        if (data) {
            const hasUnreads = data.messages.some(message => {
                if (message.seen === false && parseInt(message.creator_id) !== user.id) {
                    return true
                }
                return false
            })
       
            if (hasUnreads) {
                dispatch(fetchReadConversation(data.id))
            }
        }

    }, [data, user, dispatch])
    

    const getMessageElements = () => {
        const sortedMessages = [...data.messages].sort(function(a, b) {
            return (a.added < b.added) ? 1 : ((a.added > b.added) ? -1 : 0);
        })
        const elements = sortedMessages.map(message => {
            
            const other = (  user.id === parseInt(message.creator_id) ? false : true)
            return (
                <Message key={message.id} message={message} other={other}/>               
            )
        })
        return elements
    }

    const getOther = (full) => {
        const other = data.users.find(other => parseInt(other.id) !== parseInt(user.id))    
        if (!full) {
            return other.id
        } else {
            return other
        }
    }

    const handleSend = (message) => {
        const toUser = getOther()
        const messageData = {
            from: user.id,
            conversationId: data.id,
            text: message,
            to: toUser
        }

        dispatch({
            type: 'SEND_WEBSOCKET_MESSAGE',
            payload: messageData
        })
        
    }
    
    return (
            <StyledConversationContainer>
                <ConversationInfo user={getOther(true)}/>
                <StyledMessagesContainer>
                    {getMessageElements()}
                </StyledMessagesContainer>
                <MessageInput handleSend={handleSend} />
            </StyledConversationContainer>
        )
}


export default Conversation