import React from "react";
import { useSelector } from "react-redux";
import { selectCategoryName } from "../Categories/categoriesSlice";
import { Card } from "../Styles/GlobalStyles";
import styled from "styled-components";

const StyledListing = styled(Card)`
    display: flex;
    flex-direction: column;
    gap: 10px;
    cursor: pointer;    
    > p {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        margin: 0;
    }
`

const ListingCard = ({ data }) => {
    // const categoryName = useSelector(state => selectCategoryName(state.categories.data, data.category_id))
    //console.log(data)
    return (
        <StyledListing>
            <p>{data.name}</p>           
        </StyledListing>
    )
}

export default ListingCard