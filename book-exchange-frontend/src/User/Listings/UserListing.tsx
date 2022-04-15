import React, { useState } from "react";
import { DangerButton, SecondaryButton } from "../../Styles/GlobalStyles";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from '../../Hooks/hooks'
import { removeListing } from "../../Listings/listingsSlice";
import { deleteUserListing, updateListingStatus } from "../userSlice";
import useCheckMobileScreen from "../../Hooks/useCheckMobile";
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
    
    min-width: 100px;
    word-break: break-word;
`
const StyledTagContainer = styled.div` 
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;    
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
`
const StyledButtonContainerMobile = styled.div` 
    display: flex;
    gap: 10px;
    box-sizing: border-box;
    width: 100%;
    > button {
        flex-basis: 50px;
        flex-grow: 0.5;
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
const StyledStatusSelect = styled.select` 
    height: 32px;
    border: 2px solid var(--dark-blue);
    color: var(--dark-blue);
    font-weight: 600;
    font-size: 1rem;    
`
const StyledSelectOption = styled.option` 
    color: black;    
    background-color: white;
    padding: 10px;
    margin: 10px;
    :checked{
        color: black;        
        background-color: white;
    }    
`

interface IProps {
    data: Listing
}

const UserListing: React.FC<IProps> = ({ data }) => {
    const [statusInput, updateStatus] = useState(data.status)
    const isMobile = useCheckMobileScreen()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    
    const getTagElements = () => {
        const elements: JSX.Element[] = data?.tags?.map(tag => <StyledTag key={tag.id}>{tag.text}</StyledTag>)!
        return elements
    }

    const handleDeleteClick = () => {
        dispatch(deleteUserListing(data.id))
        dispatch(removeListing({id:data.id}))
    }

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {        
        updateStatus(event.target.value as ("active" | "inactive" | "engaged"))
        dispatch(updateListingStatus({
            id: data.id,
            status: event.target.value
        }))
        
    }

    const handleEditClick = () => {
        navigate('../profil/creator', {state: {type: data.type, edit: true, data: data}})
    }

    if (isMobile) {
        return (
            <StyledListingMobileContainer>
                <StyledNameMobile>{data.name}</StyledNameMobile>
                <StyledTagContainerMobile>{getTagElements()}</StyledTagContainerMobile>            
                <StyledButtonContainerMobile>
                    <StyledStatusSelect value={statusInput} onChange={handleStatusChange}>
                        <StyledSelectOption value="active">Dostupné</StyledSelectOption>
                        <StyledSelectOption value="engaged">Zamluvené</StyledSelectOption>
                        <StyledSelectOption value="inactive">Nedostupné</StyledSelectOption>
                    </StyledStatusSelect>
                    <StyledEditButton onClick={handleEditClick}><p>Upravit</p></StyledEditButton>
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
                    <StyledStatusSelect value={data.status} onChange={handleStatusChange}>  
                        <StyledSelectOption value="active">Dostupné</StyledSelectOption>    
                        <StyledSelectOption value="engaged">Zamluvené</StyledSelectOption>                        
                        <StyledSelectOption value="inactive">Nedostupné</StyledSelectOption>                        
                    </StyledStatusSelect>
                    <StyledEditButton onClick={handleEditClick}><p>Upravit</p></StyledEditButton>
                    <StyledDeleteButton onClick={handleDeleteClick}><p>Smazat</p></StyledDeleteButton>
                </StyledButtonContainer>
            </StyledListingContainer>
        ) 
    }
   

}

export default UserListing