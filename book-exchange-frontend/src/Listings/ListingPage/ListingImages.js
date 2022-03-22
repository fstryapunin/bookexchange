import React from "react";
import styled from "styled-components";
const apiAdress = process.env.REACT_APP_API_ADRESS

const StyledImagesContainer = styled.div` 
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px , 1fr));
    grid-gap: 20px;
    box-sizing: border-box;
    gap: 20px;
    width: 100%;
    margin-top: 30px;    
`
const StyledImage = styled.div`
        
    background: url(${props => `"${props.background}"`}) center no-repeat;
    background-size: cover;
    border-radius: 20px;
    :after {
        content: "";
        display: block;
        padding-bottom: 100%;
    }
    
`

const ListingImages = ({images}) => {    
    const getImageElements = () => {
        const elements = images.map((image, index) => <StyledImage key={index} background={`${apiAdress}/public/uploads/${image.file_name}`} />)
        return elements
    }

    return (
        <StyledImagesContainer>
            {getImageElements()}            
        </StyledImagesContainer>
    )
}

export default ListingImages