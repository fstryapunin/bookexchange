import React from "react";
import { PrimaryButton } from "../../Styles/GlobalStyles";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const StyledMessageButton = styled(PrimaryButton)`
   padding: 10px;  
   margin: 0px;  
   margin-left: auto;
`

const ListingReact = ({data}) => {
    const dispatch = useDispatch()
    const userId = useSelector(state => state.user.info.data.id)

    const sendMessage = () => {        
        const messageData = {
            from: userId,            
            text: 'test',
            to: data.user.id,
            embedded: data.id
        }
        console.log(messageData)

        dispatch({
            type: 'SEND_WEBSOCKET_MESSAGE',
            payload: messageData
        })

    } 

    return (
        <StyledMessageButton onClick={sendMessage}>REAGOVAT</StyledMessageButton>
    )
}

export default ListingReact