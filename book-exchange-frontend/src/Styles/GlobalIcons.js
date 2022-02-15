import styled from 'styled-components'
import { ChevronLeft } from '@styled-icons/bootstrap/ChevronLeft'
import { ChevronRight } from '@styled-icons/bootstrap/ChevronRight'
import { CircleWithCross } from '@styled-icons/entypo/CircleWithCross'


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

export const SmallDeleteIcon = styled(CircleWithCross)` 
    width: 1.5rem;
    height: 1.5rem;
    cursor: pointer;
`