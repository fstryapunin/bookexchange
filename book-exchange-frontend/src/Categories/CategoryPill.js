import React from "react";
import styled from "styled-components";

const StyledCategory = styled.div`
    background-color: white;
    padding: 5px 10px;
    cursor: pointer;
    text-align: center;
    border: 2px solid var(--dark-blue);
    border-radius: 15px;
    display: inline-block;

    p{
        margin: 0;
        text-transform: uppercase;
        font-weight: bold;
        color: var(--dark-blue);
    }
`

const Category = ({ data }) => {
    return (
        <StyledCategory>
            <p>{data.name}</p>
        </StyledCategory>
    )
}

export default Category