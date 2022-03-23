import React from "react";
import { Card } from "../../Styles/GlobalStyles";
import styled from "styled-components";

const UserValues = styled.div`
    display: flex;
    gap: 15px;
`

const UserName = styled.h2`    
    word-break: break-word;    
    margin: 0;   
`
const UserEmail = styled.h5`
    font-weight: 400;
    margin: 0px 0px 0px 2px;
    word-break: break-all;
`

const ProfileImage = styled.img`
    background-color: var(--dark-gray);   
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 5px;  
    width: 96px;
    height: 96px;    
`
const UserInfo = ({ user }) => {  

    return (        
        <Card>            
            <UserValues>
                <ProfileImage src={user.link} referrerPolicy="no-referrer"/>
                <div>
                    <UserName>
                        {`${user.firstName} ${user.lastName}`}
                    </UserName>
                    <UserEmail>
                        {user.email}
                    </UserEmail>
                </div>
            </UserValues>
        </Card>        
    )
}

export default UserInfo