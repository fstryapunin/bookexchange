import React from "react";
import styled from "styled-components";

const StyledUserContainer = styled.div` 
    background-color: var(--dark-blue);
    color: white;
    text-align: left;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 1rem;
`

const StyledUserName = styled.h5` 
    margin:0;
`

const ConversationInfo = ({ user }) => {
    
    return (
        <StyledUserContainer>
            <StyledUserName>{user.first_name + ' ' + user.last_name}</StyledUserName>
        </StyledUserContainer>
    )
}

export default ConversationInfo