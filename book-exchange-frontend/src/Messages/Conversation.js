import React, {useEffect} from 'react'
import { Card } from '../Styles/GlobalStyles'
import { fetchReadConversation } from './messagesSlice'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

const StyledConversationContainer = styled(Card)`
    position: relative;
    left: 20px;
    flex-grow: 1;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const StyledMessageContainer = styled.div` 
    display: flex;
    gap: 10px;
    box-sizing: border-box;
    max-width: 70%;
    align-self: ${props => props.other ? 'flex-start' : 'flex-end'};
`

const StyledMessage = styled.p` 
    margin: 0;
    padding: 5px;
    border-radius: 5px;   
    border: ${props => props.other ? '2px solid var(--medium-gray)' : '2px solid var(--dark-blue)'};
    align-self: center;
`

const Conversation = ({ data, user }) => {  
    const dispatch = useDispatch()

    useEffect(() => {
        //if has any unreads dispatch seen update
        const hasUnreads = data.messages.some(message => {
            if( message.seen === false && parseInt(message.creator_id) !== user.id){
               return true
            }
            return false
        })
        console.log(hasUnreads)
        console.log(data)
        if (hasUnreads) {
            console.log('ran')
            dispatch(fetchReadConversation(data.id))            
        }

    }, [data, user, dispatch])
    

    const getMessageElements = () => {
        const sortedMessages = [...data.messages].sort(function(a, b) {
            return (a.added < b.added) ? -1 : ((a.added > b.added) ? 1 : 0);
        })
        const elements = sortedMessages.map(message => {
            
            const other = (  user.id === parseInt(message.creator_id) ? false : true)
            return (
                <StyledMessageContainer key={message.id} other = {other}>
                    <StyledMessage other = {other}>
                        {message.text}
                    </StyledMessage>                    
                </StyledMessageContainer>
            )
        })
        return elements
    }

    return (
        <StyledConversationContainer>
            {getMessageElements()}
        </StyledConversationContainer>
    )
}

export default Conversation