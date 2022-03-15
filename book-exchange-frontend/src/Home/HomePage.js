import React from "react";
import ListingsContainer from "../Listings/ListingsContainer";
import FilterControl from "./Filter/FilterControl";
import styled from "styled-components";
import { SectionHeading } from "../Styles/GlobalStyles";
import { useDispatch } from "react-redux";

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
    const dispatch = useDispatch()    

    return (
        <StyledHomepage>
            <FilterControl/>
            <HomepageHeading>NOVÉ PŘÍSPĚVKY</HomepageHeading>            
            <ListingsContainer />            
            <button onClick={() => {
                dispatch({
                    type: 'GET_WEBSOCKET_TAGS',
                    payload: 'a'
            })}}></button>
        </StyledHomepage>
    )
}

export default HomePage