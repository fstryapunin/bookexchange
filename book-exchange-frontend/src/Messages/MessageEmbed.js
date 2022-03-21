import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchListingById } from "../Listings/listingsSlice";
import styled, {keyframes} from "styled-components";
const apiAdress = process.env.REACT_APP_API_ADRESS

const StyledEmbed = styled.div`     
    min-width: 200px;
    padding: ${props=> props.loaded? '0': '0.75rem'};
    background-color: var(--dark-blue);
    margin-bottom: 10px;
    border-radius: 15px;
    overflow: hidden;
    color: white;
    cursor: pointer;
`

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${rotate360} 2s linear infinite;  
  border-top: 5px solid lightgray;
  border-right: 5px solid lightgray;
  border-bottom: 5px solid lightgray;
  border-left: 5px solid var(--dark-blue);
  background: transparent;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 0px auto;
`;

const StyledEmbedImage = styled.img` 
    box-sizing: border-box;
    max-width: 100%;
`
const StyledEmbedInfo = styled.div` 
    box-sizing: border-box;
    max-width: 100%;
    padding: 0.75rem;    
`
const StyledEmbedName = styled.p` 
    margin: 0;
    font-weight: bolder;
`

const MessageEmbed = ({ id }) => {   
    const dispatch = useDispatch()  

    const selectedEmbed = useSelector(state => {        
        const listings = state.listings.homepage.data        
        const listing = listings.find(listing => listing.id === id)        
        return listing
    })
    
    useEffect(() => { 
        if (!selectedEmbed) {
            dispatch(fetchListingById(id))
        }
    },
    [selectedEmbed, dispatch, id])   

    if (selectedEmbed) {
        return (
            <StyledEmbed loaded={true}>
                <StyledEmbedImage src={`${apiAdress}/public/uploads/${selectedEmbed.title_image}`} />
                    <StyledEmbedInfo>
                        <StyledEmbedName>
                        {selectedEmbed.name}
                    </StyledEmbedName>
                </StyledEmbedInfo>
            </StyledEmbed>
        )
    } else {
        return (
            <StyledEmbed>
                <Spinner/>
            </StyledEmbed>
        )
    }
}

export default MessageEmbed