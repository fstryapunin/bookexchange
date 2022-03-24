import React, { useState, useEffect } from "react";
import { Card } from "../../Styles/GlobalStyles";
import ListingReact from "./ListingReact";
import { useSelector } from "react-redux";
import ErrorCard from '../../Info/ErrorCard'
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

const StyledPriceHeading = styled.h6` 
    color: var(--dark-blue);
    margin: 0;
    padding: 10px 20px;
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
    border-radius: 50%;
    height: 3rem;
    width: 3rem;
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
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
`
const StyledUserNameContainer = styled.div` 
    display: flex;
    flex-direction: column;
    align-items: start;
    > h6 {
        margin: 0;
    }
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
    const userId = useSelector(state => state.user.info.data.id)

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

    const getReactionElement = () => {
        if (userId !== parseInt(listingData.user.id) && listingData.status === "active") {
            return <ListingReact data={listingData}/>  
        } else return null
    }

    if (status === 'idle') {
        return (
            <LoaderContainer>
                <Loader />
            </LoaderContainer>
        )
    }else if (status === 'loaded') {
        return (
            <StyledListingPage>
                <StyledListingCard>
                    <StyledTopContainer>
                        <StyledTypeHeading>{getTypeText()}</StyledTypeHeading>
                        {listingData.type === 'listing' ? getStatusBar() : null}
                        <StyledPriceHeading>{listingData.price} Kč</StyledPriceHeading>
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
                                <h6>{listingData.user.first_name}</h6>
                                <h6>{listingData.user.last_name}</h6>
                            </StyledUserNameContainer>                                       
                            {getReactionElement()}                                          
                        </StyledUserContainer>                  
                    </StyledListingCardInner>
                </StyledListingCard>
            </StyledListingPage>
        )
    } else {
        return (
            <StyledListingPage>
                <ErrorCard text="Nic nenalezeno"></ErrorCard>
            </StyledListingPage>
        )
    }
}

export default ListingPage