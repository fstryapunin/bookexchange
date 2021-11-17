import React from "react";
import styled from "styled-components";


const StyledProfile = styled.div`
width: 100%;
box-sizing: border-box;
max-width: 1140px;
display: flex;
justify-content: center;
`

const UserProfile = ({ userData }) => {   
        return (
            <StyledProfile>             
                <div>
                    <h1>Logged in</h1>
                    <h2>{`Jméno ${userData.data.firstName}`}</h2>
                </div>                    
            </StyledProfile>
        )    
}

export default UserProfile