import styled from 'styled-components'
import { ChevronLeft } from '@styled-icons/bootstrap/ChevronLeft'
import { ChevronRight } from '@styled-icons/bootstrap/ChevronRight'


export const LeftIcon = styled(ChevronLeft)`
    cursor: pointer;
    width: 1.5rem;
    height: 1.5rem;
    stroke: black;
    stroke-width: 0.9px;
    user-select: none;
    :active{
        stroke: var(--dark-blue);
    }
`

export const RightIcon = styled(ChevronRight)`
    cursor: pointer;
    width: 1.5rem;
    height: 1.5rem;
    stroke: black;
    stroke-width: 0.9px;
    user-select: none;
    :active{
        stroke: var(--dark-blue);
    }    
`