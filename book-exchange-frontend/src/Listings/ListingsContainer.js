import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import ListingCard from "../Listings/ListingCard";
import { fetchListings } from "./listingsSlice";
import Loader from '../Loader/Loader'
import styled from "styled-components";

const StyledContainer = styled.div` 
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px , 1fr));
    grid-gap: 10px;
`
const LoaderContainer = styled.div` 
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const ListingsContainer = () => {
    const dispatch = useDispatch()
    const listingStatus = useSelector(state => state.listings.status)
    const listings = useSelector(state => state.listings.data)

    useEffect(() => {
        if (listingStatus === 'idle') {
            dispatch(fetchListings())
        }
    }, [listingStatus, dispatch])
    
    const getListings = () => {        
        const listingElements = listings.map(listingObj => <ListingCard key={listingObj.id} data={listingObj}/>)
        return listingElements
    }

    if (listingStatus === 'loaded') {
        return (
            <div>
                <StyledContainer>
                    {getListings()}
                </StyledContainer>
            </div>
        )
    } else if (listingStatus === "idle" || listingStatus === "loading") {
        return (
            <LoaderContainer>
                <Loader />
            </LoaderContainer>
        )
    } else {
        return (
            <h5>Chyba</h5>
        )
    }
}

export default ListingsContainer