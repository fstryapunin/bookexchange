import React from "react";
import { Card } from "../Styles/GlobalStyles";
import styled from "styled-components";

const StyledListingName = styled.h6` 
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin: 0px 0px 15px 0px;
    font-weight: normal;
`
const StyledListingType = styled.p` 
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
const StyledImage = styled.image` 
    object-fit: cover;
    position: absolute;
    top:0;
    right:0;
    left:0;
    bottom:0;
    z-index:10;
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

const ListingCard = ({ data }) => {
    // const categoryName = useSelector(state => selectCategoryName(state.categories.data, data.category_id))
    console.log(data)

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
        <StyledListing>
            <StyledImageContainer>
                <img className="listing-image" src={getListingImageSrc() || `https://picsum.photos/600/700?rand=${Math.random() * 1000}`} alt="" />
            </StyledImageContainer>
            <StyledInfoContainer>
                <StyledListingName className="listing-name">{data.name}</StyledListingName>
                    <StyledBottomLine className="bottom-line">
                        <StyledListingType className="listing-type">{getTypeText(data.type)}</StyledListingType>
                        <StyledListingPrice>{data.price} KČ</StyledListingPrice>
                    </StyledBottomLine>
            </StyledInfoContainer>
        </StyledListing>
    )
}

export default ListingCard

//