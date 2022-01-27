import React from "react";
//import Categories from "../Categories/Categories";
import ListingsContainer from "../Listings/ListingsContainer";
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
/*const CategoriesContainer = styled.div`
    display: grid;
    flex-wrap: wrap;
    gap: 20px;    
`*/

const HomePage = () => {    
    const dispatch = useDispatch()    

    return (
        <StyledHomepage>
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