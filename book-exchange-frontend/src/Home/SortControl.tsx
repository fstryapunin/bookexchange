import React, { useState } from "react";
import { setOrder, setSort } from "../Listings/listingsSlice";
import { useAppSelector, useAppDispatch } from "../Hooks/hooks";
import styled from "styled-components";
import {ChevronDown} from '@styled-icons/entypo/ChevronDown'

const StyledSortContainer = styled.div` 
    margin: 0px 0px 25px auto;
    display: flex;
    justify-content: flex-end;
    gap: 5px;
    cursor: pointer;
    align-items: center;    
`
const StyledDownIcon = styled(ChevronDown)` 
    margin-top: 0.1rem;
    width: 1.25rem;
    height: 1.25rem;
    fill: var(--dark-gray);
`
const StyledMenu = styled.div`
    position: absolute;
    top: calc(1rem + 15px);
    left: 0;
    right: 0;
    padding: 10px;
    background-color: white;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

const StyledText = styled.p` 
    margin: 0;
    color: var(--dark-gray);
    font-weight: bolder;
    position: relative;
    user-select: none;
`
const StyledOption = styled.p` 
    cursor: pointer;
    color: var(--dark-gray);
    font-weight: bolder;
    margin: 0;
    user-select: none;
`

const StyledMenuContainer = styled.div` 
    position: relative;
    display: flex;
    gap: 5px;
`
interface IOption {
    text: string,
    type: string,
    value: 'min' | 'max'
}

const options: IOption[] = [
    {
        text: 'Od nejnovějšího',
        type: 'date',
        value: 'min'
    }, {
        text: 'Od nejlevnějšího',
        type: 'price',
        value: 'min'
    },
    {
        text: 'Od nejdražšího',
        type: 'price',
        value: 'max'
    },
    {
        text: 'Od nejstaršího',
        type: 'date',
        value: 'max'
    }  
]

const SortControl: React.FC = () => {
    const [displayMenu, updateMenu] = useState<boolean>(false)
    const sortText = useAppSelector(state => state.listings.sort)
    const listings = useAppSelector(state => state.listings.homepage.data)
    const dispatch = useAppDispatch()

    const handleOptionClick = (option: IOption) => {        
        if (option.type === 'date') {
            const sorted = [...listings].sort((a, b) => {                
                if (a.added > b.added) {
                    if (option.value === 'max') return 1;
                    if(option.value === 'min') return -1;
                  }
                  if (a.added < b.added) {
                    if (option.value === 'max') return -1;
                    if(option.value === 'min') return 1;                  
                  }
                  // a must be equal to b
                  return 0;
            })
            dispatch(setOrder(sorted))            
        } 
        if (option.type === 'price') {            
            const sorted = [...listings].sort((a, b) => {                
                if (parseInt(a.price as string) > parseInt(b.price as string)) {
                    if (option.value === 'max') return -1;
                    if(option.value === 'min') return 1;
                  }
                  if (parseInt(a.price as string) < parseInt(b.price as string)) {
                    if (option.value === 'max') return 1;
                    if(option.value === 'min') return -1;                  
                }   
                
                  // a must be equal to b
                  return 0;
            })
            dispatch(setOrder(sorted))  
        }
        dispatch(setSort(option.text))
        updateMenu(false)
    }

    const getOptions = () => {
        const elements: JSX.Element[] = []

        options.forEach(option => {
            if (option.text !== sortText) {
                elements.push(<StyledOption key={option.text} onClick={() => handleOptionClick(option)}>{option.text}</StyledOption>)
            }
        })

        return elements
    }


    return (
        <>
            <StyledSortContainer>
                <StyledMenuContainer>
                    <StyledText onClick={() => updateMenu(prev => !prev)}>{sortText}</StyledText>
                    <StyledDownIcon />    
                    {displayMenu ?
                    <StyledMenu>
                        {getOptions()}
                    </StyledMenu>
                            : null}
                    </StyledMenuContainer>
            </StyledSortContainer>            
        </>
    )
}

export default SortControl