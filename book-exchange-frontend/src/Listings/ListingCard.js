import React from "react";
import { Card } from "../Styles/GlobalStyles";
import { Link } from 'react-router-dom'
import styled from "styled-components";

const StyledListingName = styled.p`     
    overflow-wrap: break-word;
    hyphens: auto;
    margin: 10px 0px 10px 0px;
    font-weight: normal;
    line-height: 1.5;
    min-height: 3rem;    
    font-weight: 500;
    word-spacing: -3px;
    font-family: 'Roboto Mono', monospace; 
`

const StyledListingType = styled.p` 
    font-weight: bold;
    margin: 0px 0px 5px 0px;
    color: var(--dark-blue);
    text-transform: uppercase;
`

const StyledBottomLine = styled.div` 
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
`

const StyledListingPrice = styled.p`
    margin: 0;
    font-weight: 700;
`

const StyledInfoContainer = styled.div` 
    padding: 15px 25px 15px 25px;
`

const StyledListing = styled(Card)`
    padding: 0px;
    display: flex;
    flex-direction: column;   
    height: 100%; 
    cursor: pointer;  
`

const StyledImageContainer = styled.div` 
    box-sizing: border-box;
    width: 100%;
    padding-bottom: 100%;
    background-color: var(--dark-gray) ;
    position: relative;    
`

const StyledListingImage = styled.img` 
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit:cover; 
`
const StyledTagContainer = styled.div`
    margin-top: 10px;
    padding-top: 10px;
    border-top: 3px solid var(--medium-gray);
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
`

const StyledLink = styled(Link)` 
    text-decoration: none;
    color: inherit;
`
const StyledTag = styled.p` 
    background-color: var(--dark-blue);
    color: white;
    border-radius: 10px;
    margin: 0;
    padding: 2px 10px 5px 10px;
`

const ListingCard = ({ data }) => {  
    const apiAdress = process.env.REACT_APP_API_ADRESS    

    const getTypeText = (type) => {
        switch (type) {
            case 'listing':
                return 'prodám'                
            case 'demand':
                return 'koupím'
            default:
                return ''
        }
    }
    
    const getTagElements = () => {
        const elements = data.tags.map(tag => { return <StyledTag>{tag.text}</StyledTag> })        
        return elements
    }

    return (
        <StyledLink to={`/listing/${data.id}`}>
            <StyledListing>                
                <StyledImageContainer>
                    <StyledListingImage src={`${apiAdress}/public/uploads/${data.title_image}`} alt="" />
                </StyledImageContainer>                
                <StyledInfoContainer>
                    <StyledListingType>{getTypeText(data.type)}</StyledListingType>
                    <StyledListingName>{data.name}</StyledListingName>
                    <StyledBottomLine>                            
                        <StyledListingPrice>{data.price} KČ</StyledListingPrice>
                    </StyledBottomLine>
                    <StyledTagContainer>
                        {getTagElements()}
                    </StyledTagContainer>
                </StyledInfoContainer>
            </StyledListing>
        </StyledLink>
    )
}

export default ListingCard