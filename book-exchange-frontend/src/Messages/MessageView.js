import React from "react";
import { SectionHeading, Card } from '../Styles/GlobalStyles'
import styled from "styled-components";

const MessagesContainer = styled(Card)`
    box-sizing: border-box;
    width: 100%;
    background-color: white;
`

const MessageView = () => {
    return (
        <MessagesContainer>
            <SectionHeading margin='0px'>ZPRÁVY</SectionHeading>
        </MessagesContainer>
    )
}

export default MessageView