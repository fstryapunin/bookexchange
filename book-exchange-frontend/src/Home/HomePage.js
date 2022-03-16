import React from "react";
import ListingsContainer from "../Listings/ListingsContainer";
import FilterControl from "./Filter/FilterControl";
import styled from "styled-components";
import { SectionHeading } from "../Styles/GlobalStyles";

const HomepageHeading = styled(SectionHeading)` 
    margin-bottom: 25px;
`

const StyledHomepage = styled.div`
    max-width: 1140px;
    margin-left: auto;
    margin-right: auto;
    padding:25px;
    box-sizing: border-box;
`

const HomePage = () => {    

    return (
        <StyledHomepage>
            <FilterControl/>                       
            <ListingsContainer />             
        </StyledHomepage>
    )
}

export default HomePage