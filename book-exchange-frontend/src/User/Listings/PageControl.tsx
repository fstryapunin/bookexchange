import React from "react";
import styled from "styled-components";
import { LeftIcon, RightIcon } from "../../Styles/GlobalIcons";


const StyledControl = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    > h4 {
        font-weight: bold;
        margin: 0;
        padding-bottom: 3px;
        user-select: none;
    }
`

interface IProps {
    dataLength: number,
    pageSize: number,
    currentPage: number,
    updateCurrentPage: (arg: number) => void
}

const PageControl: React.FC<IProps> = ({ dataLength, pageSize, currentPage, updateCurrentPage }) => {    
    const maxPages = Math.round(dataLength / pageSize)    
    const handlePageChange = (modifier: number) => {
        const nextPage = currentPage + modifier
        if (nextPage < maxPages && nextPage >= 0) {          
            updateCurrentPage(nextPage)
        }
    } 

    return (
        <StyledControl>
            <LeftIcon onClick={() => handlePageChange(-1)}/>
            <h4>{currentPage + 1}</h4>
            <RightIcon onClick={() => handlePageChange(1)}/>           
        </StyledControl>
    )
}

export default PageControl