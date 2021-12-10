import React from "react";
import styled from "styled-components";

const StyledCategory = styled.div`
    background-color: white;
    padding: 10px 15px;
    cursor: pointer;
    text-align: center;
    border: 3px solid var(--dark-blue);  
    display: inline-block;
    user-select: none;
    transition: 0.3s;
    p{
        margin: 0;
        text-transform: uppercase;
        font-weight: 700;
        color: var(--dark-blue);
    }
    :hover{
        background-color: var(--dark-blue);
        > p {color: white;}
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