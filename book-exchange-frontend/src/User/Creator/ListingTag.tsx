import React from 'react'
import { SmallDeleteIcon } from '../../Styles/GlobalIcons';
import styled from "styled-components";


const Tag = styled.p` 
    padding: 5px 10px;
    text-transform: capitalize;
    margin: 0;
    cursor: pointer;
    :hover{
        transition: 0.2s;
        background-color: var(--dark-gray);
    }
`

const SelectedTag = styled.div` 
    padding: 7.5px 5px 7.5px 10px;
    border-radius: 15px;
    background-color: var(--dark-blue);
    color: white;
    text-transform: capitalize;
    display: flex;
    height: min-content;
    gap: 5px;
    width: min-content !important;
    > p {
        margin: 0px;
        display: inline-block;
    }
`

interface IProps {
    data: Tag | {text: string},
    handleClick: (arg0: any, arg1: any, arg2: any) => void,
    selected?: boolean,
    custom? : boolean
}

const ListingTag: React.FC<IProps> = ({ data, handleClick, selected, custom }) => {
    if (!selected) {
        return (
            <Tag onClick={() => handleClick(data, 'select', custom)}> {data.text}</Tag>
        )        
    } else {    
        return (
            <SelectedTag>
                <p> {data.text}</p>
                <SmallDeleteIcon onClick={() => handleClick(data, 'remove', custom)} />
            </SelectedTag> 
        )
    }
}

export default ListingTag