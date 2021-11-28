import React, {useState, useEffect} from "react";
import styled from "styled-components";
import Loader from "../Loader/Loader";
import UserInfo from "./UserInfo";
import MessageView from "../Messages/MessageView";
import { SecondaryButton } from "../Styles/GlobalStyles";
import UserListings from "./UserListings";
import UserDemands from "./UserDemands";
import { useNavigate } from "react-router";
const apiAdress = process.env.REACT_APP_API_ADRESS

const StyledProfile = styled.div`
    width: 100%;
    box-sizing: border-box;
    max-width: 1140px;    
    margin-left: auto;
    margin-right: auto;
    padding: 25px;
`
const Center = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`
const FlexContainer = styled.div`
    display: flex;
    gap: 25px;
`

const ButtonContainer = styled.div`
    margin-top: 15px;
    display: flex;
    gap: 15px;
`
const FlexButton = styled(SecondaryButton)`
    flex-grow: 1;
    flex-basis: 50px;
`

const UserProfile = ({ user }) => {    
    const [userData, updateUserData] = useState({
        loaded: false
    })
    const navigate = useNavigate()

    const fetchUser = async () => {        
        const userResponse = await fetch(`${apiAdress}/getUserProfile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: user.token
            })
        })
        if (userResponse.ok) {
            const data = await userResponse.json()
            updateUserData({
                loaded: true,
                data: data
            })
        } else if(userResponse.status === 401){
            //navigate to token expiry error page
            navigate('/')
        } else {
            navigate('/')
        }        
    }

    const checkUser = () => {
        if (user.loaded && !user.isLogged) navigate('/')
        else if(user.loaded && user.isLogged){
            fetchUser()
        }
    }

    useEffect(checkUser, [user, navigate])

    if (user.loaded && userData.loaded) {
        return (
            <StyledProfile>
                <FlexContainer>
                    <div>
                        <UserInfo user={userData.data} />
                        <ButtonContainer>
                            <FlexButton primary={false} margin='0px'>PŘIDAT NABÍDKU</FlexButton>
                            <FlexButton primary={false} margin='0px'>PŘIDAT POPTÁVKU</FlexButton>   
                        </ButtonContainer>                     
                    </div>
                    <MessageView />
                </FlexContainer>
                <UserListings />
                <UserDemands />
            </StyledProfile>
        )
    } else {
        return (
            <Center>
                <Loader />
            </Center>
        )
    }
}

export default UserProfile