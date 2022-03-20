import React from "react";
import { Card } from "../../Styles/GlobalStyles";
import styled from "styled-components";

const UserValues = styled.div`
    display: flex;
`

const UserName = styled.h2`
    font-size: 24px;
    margin-bottom: 5px;
    font-weight: bold;
    margin-top: 0px;   
`
const UserEmail = styled.div`
    font-size: 20px;
`

const ProfileImage = styled.img`
    background-color: var(--dark-gray);   
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 5px;
    margin-right: 15px;
    min-width: 96px;
    min-height: 96px;
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