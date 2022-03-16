import styled from 'styled-components'
import { ChevronLeft } from '@styled-icons/bootstrap/ChevronLeft'
import { ChevronRight } from '@styled-icons/bootstrap/ChevronRight'
import { CircleWithCross } from '@styled-icons/entypo/CircleWithCross'
import { ImageAdd } from '@styled-icons/boxicons-regular/ImageAdd'
import { EmojiSad } from '@styled-icons/fluentui-system-filled/EmojiSad'


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

export const MediumDeleteIcon = styled(CircleWithCross)` 
    width: 2rem;
    height: 2rem;
    cursor: pointer;
`

export const AddIcon = styled(ImageAdd)` 
    width: 3rem;
    height: 3rem;
`
export const SadEmojiLarge = styled(EmojiSad)` 
    width: 80px;
    height: 80px;
    color: var(--dark-blue);
`