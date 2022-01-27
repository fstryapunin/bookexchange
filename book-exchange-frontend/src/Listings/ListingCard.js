import React from "react";
import { Card } from "../Styles/GlobalStyles";
import { Link } from 'react-router-dom'
import styled from "styled-components";

const StyledListingName = styled.h6` 
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin: 0px 0px 15px 0px;
    font-weight: normal;
`

const StyledListingType = styled.h6` 
    font-weight: bold;
    margin: 0;
    color: var(--dark-blue);
`

const StyledBottomLine = styled.div` 
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
`

const StyledListingPrice = styled.h6`
    margin: 0;
`

const StyledInfoContainer = styled.div` 
    padding: 15px 25px 25px 25px;
`

const StyledListing = styled(Card)`
    padding: 0px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    cursor: pointer;  
`

const StyledImageContainer = styled.div` 
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 100%;
    background-color: var(--dark-gray) ;
    position: relative;

    .listing-image{     
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit:cover; 
    }
    
`
const StyledLink = styled(Link)` 
    text-decoration: none;
    color: inherit;
`

const ListingCard = ({ data }) => {  

    const getTypeText = (type) => {
        switch (type) {
            case 'demand':
                return 'prodám'                
            case 'listing':
                return 'koupím'
            default:
                return ''
        }
    }

    const getListingImageSrc = () => {
        if (data.img_links) {
            return data.img_links[0]
        }
        else return null
    }

    return (
        <StyledLink to={`/listing/${data.id}`}>
            <StyledListing>
                <StyledImageContainer>
                    <img className="listing-image" src={getListingImageSrc() || `https://picsum.photos/600/600`} alt="" />
                </StyledImageContainer>
                <StyledInfoContainer>
                    <StyledListingName className="listing-name">{data.name}</StyledListingName>
                        <StyledBottomLine className="bottom-line">
                            <StyledListingType className="listing-type">{getTypeText(data.type)}</StyledListingType>
                            <StyledListingPrice>{data.price} KČ</StyledListingPrice>
                        </StyledBottomLine>
                </StyledInfoContainer>
            </StyledListing>
        </StyledLink>
    )
}

export default ListingCard

//