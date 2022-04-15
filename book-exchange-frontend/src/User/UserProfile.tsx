import React, { useEffect } from "react";
import { fetchUserData, fetchUserListings } from './userSlice'
import { useAppSelector, useAppDispatch } from '../Hooks/hooks'
import styled from "styled-components";
import Loader from "../Loader/Loader";
import UserInfo from "./Profile/UserInfo";
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
`
const StyledUserInfoContainer = styled.div` 
    flex-basis: 300px;
    flex-grow: 2;
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

const UserProfile: React.FC = () => {  
    const navigate = useNavigate()
    const userStatus = useAppSelector(state => state.user.info.status)
    const userData = useAppSelector(state => state.user.info.data)
    const listingsStatus = useAppSelector(state => state.user.listings.status)
    const dispatch = useAppDispatch()   

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

    const handleCreateClick = (type: string) => {
        navigate('../profil/creator', {state: {type: type}})
    }

    if (userStatus === 'loaded' && userData) {
        return (
            <StyledProfile>
                <FlexContainer>
                    <StyledUserInfoContainer>
                        <UserInfo user={userData} />
                        <ButtonContainer>
                            <FlexButton margin='0px' onClick={() => handleCreateClick('listing')}><p>PŘIDAT NABÍDKU</p></FlexButton>
                            <FlexButton margin='0px' onClick={() => handleCreateClick('demand')}><p>PŘIDAT POPTÁVKU</p></FlexButton>   
                        </ButtonContainer>                     
                    </StyledUserInfoContainer>                    
                </FlexContainer>
                <UserListings text="nabídky" type="listing"/>
                <UserListings text="poptávky" type="demand"/>                
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