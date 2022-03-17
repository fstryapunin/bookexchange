import React from "react";
import { DangerButton, SecondaryButton } from "../Styles/GlobalStyles";
import { useDispatch } from "react-redux";
import { deleteUserListing } from "./userSlice";
import useCheckMobileScreen from "../Hooks/useCheckMobile";
import styled from "styled-components";

const StyledListingContainer = styled.div` 
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0px;
    padding: 10px 0px 5px 0px;
    border-top: 2px solid var(--medium-gray);
    gap: 20px;
`

const StyledName = styled.h6` 
    margin: 0;
    font-weight: 400;
    flex-grow: 1;
    flex-basis: 100px;    
    max-width: 200px;
    min-width: 100px;
    word-break: break-word;
`
const StyledTagContainer = styled.div` 
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
    max-width:  400px;
    flex-grow: 1;
    flex-basis: 100px;
`

const StyledTag = styled.p` 
    background-color: var(--dark-blue);
    color: white;
    border-radius: 10px;
    margin: 0;
    padding: 2px 10px 5px 10px;
`
const StyledEditButton = styled(SecondaryButton)`
    padding: 5px 10px;
    margin: 0;
    box-shadow: none;
`
const StyledDeleteButton = styled(DangerButton)` 
    padding: 5px 10px;
    margin: 0;
`

const StyledButtonContainer = styled.div` 
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    align-items: center;
    margin-left: auto;
    flex-grow: 1;
`
const StyledButtonContainerMobile = styled.div` 
    display: flex;
    gap: 10px;
    box-sizing: border-box;
    width: 100%;
    > button {
        flex-basis: 50px;
        flex-grow: 1;
    }
`

const StyledNameMobile = styled.h5` 
    margin: 0;
    font-weight: 400;   
    word-break: break-word;
`
const StyledTagContainerMobile = styled.div` 
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    flex-wrap: wrap;
        
`

const StyledListingMobileContainer = styled(StyledListingContainer)` 
    display: flex;
    flex-direction: column;
    align-items: start;
    
`

const UserListing = ({ data }) => {    
    const isMobile = useCheckMobileScreen()
    const dispatch = useDispatch()
    
    const getTagElements = () => {
        const elements = data.tags.map(tag => <StyledTag>{tag.text}</StyledTag>)
        return elements
    }

    const handleDeleteClick = () => {
        dispatch(deleteUserListing(data.id))
    }

    if (isMobile) {
        return (
            <StyledListingMobileContainer>
                <StyledNameMobile>{data.name}</StyledNameMobile>
                <StyledTagContainerMobile>{getTagElements()}</StyledTagContainerMobile>            
                <StyledButtonContainerMobile>
                    <StyledEditButton><p>Upravit</p></StyledEditButton>
                    <StyledDeleteButton onClick={handleDeleteClick}><p>Smazat</p></StyledDeleteButton>
                </StyledButtonContainerMobile>
            </StyledListingMobileContainer>
        )
    } else {
        return (
            <StyledListingContainer>            
                <StyledName>{data.name}</StyledName>
                <StyledTagContainer>{getTagElements()}</StyledTagContainer>            
                <StyledButtonContainer>
                    <StyledEditButton><p>Upravit</p></StyledEditButton>
                    <StyledDeleteButton onClick={handleDeleteClick}><p>Smazat</p></StyledDeleteButton>
                </StyledButtonContainer>
            </StyledListingContainer>
        ) 
    }
   

}

export default UserListing