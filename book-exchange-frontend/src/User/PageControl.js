import React from "react";
import styled from "styled-components";

const StyledControl = styled.div`
    margin-left: auto;
    > h5 {
        font-weight: bold;
        margin: 0;
    }
`
const PageControl = ({dataLength, pageSize, currentPage, updateCurrentPage}) => {
    return (
        <StyledControl>
            <h5>{currentPage + 1}</h5>
        </StyledControl>
    )
}

export default PageControl