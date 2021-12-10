import React from "react";
import Categories from "../Categories/Categories";
import CatalogueControl from "./CatalogueControl";
import styled from "styled-components";

const StyledCatalogue = styled.div`
    padding: 25px;
    max-width: 1140px;
    width: 100%;
    box-sizing: border-box;
    margin: 0px auto;    
`
const CategoriesContainer = styled.div`
    display: flex;    
    gap: 10px;   
    background-color: white;
    padding: 20px 20px 0px 20px;
    justify-content: space-between;
    
`
const CatalogueBody = styled.div`     
`

const Catalogue = () => {
    //if selected category get category from redux, either fetch or select, if error go to error page
    //then get 20 posts by category from posts slice, if not loaded, display and add option to load next 20 and so on if not all posts were fetched. 
    return (
        <>           
        <StyledCatalogue>
            <CategoriesContainer>
                <Categories/>
            </CategoriesContainer>
            <CatalogueControl/>
            <CatalogueBody>
               
            </CatalogueBody>
        </StyledCatalogue>
        </>
    )
}

export default Catalogue