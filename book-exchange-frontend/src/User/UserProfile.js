import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { fetchUserData, fetchUserListings } from './userSlice'
import styled from "styled-components";
import Loader from "../Loader/Loader";
import UserInfo from "./Profile/UserInfo";
import MessageView from "../Messages/MessageView";
import { SecondaryButton } from "../Styles/GlobalStyles";
import UserListings from "./Listings/UserListings";
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
    const userStatus = useSelector(state => state.user.info.status)
    const userData = useSelector(state => state.user.info.data)
    const listingsStatus = useSelector(state => state.user.listings.status)
    const dispatch = useDispatch()   

    const getUser = () => {
        //fetch user if not yet fetched
        if (userStatus === 'idle') {          
            dispatch(fetchUserData())
        }
    }

    const getListings = () => {
        //fetch listings if not yet fetched
        if (listingsStatus === 'idle') {
            dispatch(fetchUserListings())
        }
    }

    useEffect(getListings, [listingsStatus, dispatch])
    useEffect(getUser, [userStatus, dispatch])

    const handleCreateClick = (type) => {
        navigate('../profil/creator', {state: {type: type}})
    }

    if (userStatus === 'loaded') {
        return (
            <StyledProfile>
                <FlexContainer>
                    <div id="user-container">
                        <UserInfo user={userData} />
                        <ButtonContainer>
                            <FlexButton primary={false} margin='0px' onClick={() => handleCreateClick('listing')}><p>PŘIDAT NABÍDKU</p></FlexButton>
                            <FlexButton primary={false} margin='0px' onClick={() => handleCreateClick('demand')}><p>PŘIDAT POPTÁVKU</p></FlexButton>   
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