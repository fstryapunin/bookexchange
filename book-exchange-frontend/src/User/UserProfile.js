import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserData, fetchUserListings } from './userSlice'
import styled from "styled-components";
import Loader from "../Loader/Loader";
import UserInfo from "./UserInfo";
import MessageView from "../Messages/MessageView";
import { SecondaryButton } from "../Styles/GlobalStyles";
import UserListings from "./UserListings";
import { useNavigate } from "react-router";
import LogoutButton from '../Auth/LogoutButton'

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
    flex-wrap: wrap;
    gap: 25px;
    div{
        flex-basis: 300px;
        flex-grow: 2;
    }
    #user-container{
        flex-grow: 1;
    }
`

const ButtonContainer = styled.div`
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
`
const FlexButton = styled(SecondaryButton)`
    flex-grow: 1;
    flex-basis: 50px;
`

const UserProfile = () => {  
    const navigate = useNavigate()
    const authStatus = useSelector(state => state.auth.status)
    const userStatus = useSelector(state => state.user.status)
    const userData = useSelector(state => state.user.data)
    const listingsStatus = useSelector(state => state.user.listingsStatus)
    const dispatch = useDispatch()   

    const getUser = () => {        
        if (authStatus === 'unauthenticated') navigate('/')
        else if (authStatus === 'authenticated' && userStatus === 'idle') {          
            dispatch(fetchUserData())
        }
    }

    const getListings = () => {
        if (listingsStatus === 'idle' && authStatus === 'authenticated') {
            dispatch(fetchUserListings())
        }
    }

    useEffect(getListings, [listingsStatus, authStatus, dispatch])
    useEffect(getUser, [authStatus, userStatus, dispatch, navigate])

    if (authStatus === 'authenticated' && userStatus === 'loaded') {
        return (
            <StyledProfile>
                <FlexContainer>
                    <div id="user-container">
                        <UserInfo user={userData} />
                        <ButtonContainer>
                            <FlexButton primary={false} margin='0px'><p>PŘIDAT NABÍDKU</p></FlexButton>
                            <FlexButton primary={false} margin='0px'><p>PŘIDAT POPTÁVKU</p></FlexButton>   
                        </ButtonContainer>                     
                    </div>
                    <MessageView />
                </FlexContainer>
                <UserListings status={listingsStatus} text="nabídky" type="listing"/>
                <UserListings status={listingsStatus} text="poptávky" type="demand"/>                
                <LogoutButton/>
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