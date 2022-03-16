import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import ListingCard from "../Listings/ListingCard";
import { fetchListings } from "./listingsSlice";
import ErrorCard from "../Info/ErrorCard";
import Loader from '../Loader/Loader'
import styled from "styled-components";

const StyledContainer = styled.div` 
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px , 1fr));
    grid-gap: 20px;
`
const LoaderContainer = styled.div` 
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`


const ListingsContainer = () => {
    const dispatch = useDispatch()
    const listingStatus = useSelector(state => state.listings.homepage.status)
    const listings = useSelector(state => state.listings.homepage.data)    

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
                <>
                {listings.length > 0 ? <StyledContainer>{getListings()}</StyledContainer > : <ErrorCard text={'Nic nenalezeno'}/>}
                </>
            
        )
    } else if (listingStatus === "idle" || listingStatus === "loading") {
        return (
            <LoaderContainer>
                <Loader />
            </LoaderContainer>
        )
    } else {
        return (
            <ErrorCard text={'Bohužel došlo k chybě'}/>
        )
    }
}

export default ListingsContainer