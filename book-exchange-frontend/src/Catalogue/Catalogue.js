import React from "react";
import Categories from "../Categories/Categories";
import styled from "styled-components";

const StyledCatalogue = styled.div`
    padding: 25px;
    max-width: 1140px;
    box-sizing: border-box;
    margin: 0px auto;    
`
const CategoriesContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    
`

const Catalogue = () => {
    //if selected category get category from redux, either fetch or select, if error go to error page
    //then get 20 posts by category from posts slice, if not loaded, display and add option to load next 20 and so on if not all posts were fetched. 
    return (
        <>
        <CategoriesContainer>
                <Categories/>
        </CategoriesContainer>
        <StyledCatalogue>            
        </StyledCatalogue>
        </>
    )
}

export default Catalogue