import React, { useState, useEffect } from "react";
import { Card, PrimaryButton } from "../../Styles/GlobalStyles";
import ListingImages from "./ListingImages";
import styled from "styled-components";
import Loader from "../../Loader/Loader";
import { useParams } from "react-router-dom";
const apiAdress = process.env.REACT_APP_API_ADRESS

const StyledListingCard = styled(Card)`     
    overflow: auto;
    padding: 0;
`
const StyledListingCardInner = styled.div` 
    padding: 25px;
`

const StyledListingPage = styled.div` 
    width: 100%;
    box-sizing: border-box;
    max-width: 1140px;
    margin-left: auto;
    margin-right: auto;
    padding: 25px;
`
const LoaderContainer = styled.div` 
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`
const StyledTypeHeading = styled.h6` 
    color: var(--dark-blue);
    flex-grow: 1;
    margin: 0;
    padding: 10px;
    text-align: center;
    background-color: var(--dark-blue);
    color: white;
`

const StyledListingHeading = styled.h3` 
    margin: 0;
`
const StyledDescription = styled.p` 
    margin: 20px 0px 30px 0px;
    padding: 30px 5px 0px 5px;
    line-height: 1.5;
    border-top: 4px solid var(--medium-gray);
`

const StyledUserImage = styled.img` 
    border-radius: 50px;
    height: 4rem;
    width: 4rem;
`
const StyledStatusBar = styled.h6` 
    padding: 10px 20px;
    margin: 0;
    text-align: center;
    background-color: ${props => props.color};
    color: white;
    text-transform: uppercase;
    
`
const StyledTopContainer = styled.div` 
    display: flex;    
    align-items: start;
`
const StyledUserContainer = styled.div` 
    border-top: 4px solid var(--medium-gray);
    box-sizing: border-box;
    width: 100%;
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`
const StyledUserNameContainer = styled.div` 
    display: flex;
    flex-direction: column;
    align-items: start;
    > h5 {
        margin: 0;
    }
`
const StyledMessageButton = styled(PrimaryButton)` 
    margin: 0;
    padding: 10px;
    align-self: end;
    margin-left: auto;
`

const StyledTagContainer = styled.div`    
    margin-top: 20px;     
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`
const StyledTag = styled.h6` 
    background-color: var(--dark-blue);
    color: white;
    border-radius: 10px;
    margin: 0;
    padding: 7px 15px 10px 15px;
`

const ListingPage = () => {
    const params = useParams()
    const [status, updateStatus] = useState('idle')
    const [listingData, updateListingData] = useState({})
    const listingId = params.id   

    const loadListing = async () => {            
        const response = await fetch(`${apiAdress}/public/listing/${listingId}`)
        if (response.ok) {
            const data = await response.json()
            updateListingData(data)
            updateStatus('loaded')
        } else if (response.status === 400 || response.status === 404) {
            updateStatus('failed') 
        }    
    }
    
    useEffect(() => {
        if (status === 'idle') {
            loadListing()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    const getTypeText = () => {
        if (listingData.type === 'listing') return 'PRODÁM'
        else return 'KOUPÍM'
    }

    const getStatusBar = () => {
        switch (listingData.status) {
            case 'active':
                return <StyledStatusBar color="#48A14D">Dostupné</StyledStatusBar>
            case 'engaged':
                return <StyledStatusBar color="#D7C756">Zamluvené</StyledStatusBar>
            case 'inactive':
                return <StyledStatusBar color="#B32020">Nedostupné</StyledStatusBar> 
            default:
                break;
        }
    }

    const getTagElements = () => {
        const elements = listingData.tags.map(tag => <StyledTag key={tag.id}>{tag.text}</StyledTag>)
        return elements
    }

    if (status === 'idle') {
        return (
            <LoaderContainer>
                <Loader />
            </LoaderContainer>
        )
    }
    else if (status === 'loaded') {
        return (
            <StyledListingPage>
                <StyledListingCard>
                    <StyledTopContainer>
                        <StyledTypeHeading>{getTypeText()}</StyledTypeHeading>
                        {listingData.type === 'listing' ? getStatusBar() : null}
                    </StyledTopContainer>
                <StyledListingCardInner>                    
                    <StyledListingHeading>{listingData.name}</StyledListingHeading>
                    <ListingImages images={listingData.images} />
                        <StyledTagContainer>
                            {getTagElements()}
                        </StyledTagContainer>    
                    <StyledDescription>
                        {listingData.description}
                    </StyledDescription>
                   
                        <StyledUserContainer>
                            <StyledUserImage referrerPolicy="no-referrer" src={listingData.user.img_link} />
                            <StyledUserNameContainer>
                                <h5>{listingData.user.first_name}</h5>
                                <h5>{listingData.user.last_name}</h5>
                                </StyledUserNameContainer>  
                                <StyledMessageButton>REAGOVAT</StyledMessageButton>       
                        </StyledUserContainer>
                         
                   
                    </StyledListingCardInner>
                </StyledListingCard>
            </StyledListingPage>
        )
    } else {
        return (
            <LoaderContainer>
                <h1>Chyba</h1>
            </LoaderContainer>
        )
    }
}

export default ListingPage