import React from "react";
import ListingsContainer from "../Listings/ListingsContainer";
import FilterControl from "./Filter/FilterControl";
import styled from "styled-components";
import SortControl from "./SortControl";

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
            <FilterControl />   
            <SortControl />
            <ListingsContainer />             
        </StyledHomepage>
    )
}

export default HomePage