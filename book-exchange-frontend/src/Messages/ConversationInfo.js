import React from "react";
import styled from "styled-components";
import { SmallDeleteIcon } from "../Styles/GlobalIcons";

const StyledUserContainer = styled.div` 
    background-color: var(--dark-blue);
    color: white;
    text-align: left;    
    padding: 1rem;
    margin: 0px -25px 10px -25px;
    display: flex;
    justify-content: space-between;
`

const StyledUserName = styled.h5` 
    margin:0;
`
const StyledCloseIcon = styled(SmallDeleteIcon)` 
    height: 2.25rem;
    width: 2.25rem;
`

const ConversationInfo = ({ user, reset }) => {
    
    return (
        <StyledUserContainer>
            <StyledUserName>{user.first_name + ' ' + user.last_name}</StyledUserName>
            {reset? <StyledCloseIcon onClick={reset}/> : null}
        </StyledUserContainer>
    )
}

export default ConversationInfo