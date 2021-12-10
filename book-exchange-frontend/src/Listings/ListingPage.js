import React, {useState, useEffect} from "react";
import styled from "styled-components";
import Loader from "../Loader/Loader";
import { useParams } from "react-router-dom";
const apiAdress = process.env.REACT_APP_API_ADRESS

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

const StyledListingHeading = styled.h3` 
    margin: 0;
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
                <StyledListingHeading>
                    {listingData.name}
                </StyledListingHeading>
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