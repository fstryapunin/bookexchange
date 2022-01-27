import React from 'react'
import styled from 'styled-components'

const StyledControl = styled.div` 
    display: flex;
    gap: 20px;
    background-color: white;
    padding: 20px;
    
    > input{
        flex-grow: 1;
        min-height: 30px;
        padding: 5px 10px;
        border: var(--dark-blue) 3px solid;
        font-size: 1rem;
    }
    > input:focus{
        outline: none;       
    }
    
`

const CatalogueControl = () => {
    return (
        <StyledControl>
            <input type="text" maxLength="50" placeholder="Hledat"></input>
            <div>Filters</div>
        </StyledControl>
    )
}

export default CatalogueControl