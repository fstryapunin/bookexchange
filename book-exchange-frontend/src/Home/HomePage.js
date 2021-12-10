import React from "react";
//import Categories from "../Categories/Categories";
import ListingsContainer from "../Listings/ListingsContainer";
import styled from "styled-components";


const StyledHomepage = styled.div`
    max-width: 1140px;
    margin-left: auto;
    margin-right: auto;
    padding:25px;
    box-sizing: border-box;
`
/*const CategoriesContainer = styled.div`
    display: grid;
    flex-wrap: wrap;
    gap: 20px;    
`*/

const HomePage = () => {    
    
    return (
        <StyledHomepage>           
            <ListingsContainer/>      
        </StyledHomepage>
    )
}

export default HomePage