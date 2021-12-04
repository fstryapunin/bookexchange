import React from "react";
import Categories from "../Categories/Categories";
import styled from "styled-components";

const StyledHomepage = styled.div`
    max-width: 1140px;
    margin-left: auto;
    margin-right: auto;
    padding:25px;

`
const CategoriesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    
`

const HomePage = () => {
    
    return (
        <StyledHomepage>
            <CategoriesContainer>
                <Categories/>
            </CategoriesContainer>           
        </StyledHomepage>
    )
}

export default HomePage