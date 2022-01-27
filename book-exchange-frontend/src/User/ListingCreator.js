import React, {useState, useEffect} from "react";
import { SectionHeading, Card } from "../Styles/GlobalStyles";
import { useLocation } from 'react-router-dom'
import { useDispatch } from "react-redux";
import styled from "styled-components";

const StyledCreator = styled(Card)` 
    max-width: 1140px;
    margin-left: auto;
    margin-right: auto;
    padding:25px;
    box-sizing: border-box;
    
`
const CreatorContainer = styled.div`
    padding: 25px;
`
const CreatorHeading = styled(SectionHeading)` 
    margin-bottom: 20px;
    white-space: nowrap;
`
const DescriptionInput = styled.textarea`
    resize: none;
    box-sizing: border-box;
    width: 100%;
`
const StyledInputRow = styled.div`
    display: flex;
    gap: 20px;
    flex-wrap: wrap;    
`
const TagRow = styled(StyledInputRow)`
    margin-top: 20px;
`
const InputContainer = styled.div`
    display: flex;
    flex-direction: column;    
    align-items: start;
    flex: ${props => props.fr};
    min-width: 100px;       
`
const TextAreaContainer = styled(InputContainer)`
    margin-top: 20px;
`
const InputField = styled.input`
    box-sizing: border-box;
    width: 100%;
    height: 30px;
`
const TagsBlock = styled.div`     
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
`
const TagsWrapper = styled.div` 
    position: relative;
`

const ListingCreator = () => {
    const listingData = {
        name: '',
        description: '',
        tags: [],
        price: 0
    }
    const location = useLocation();
    const dispatch = useDispatch();
    const type = location.state.type   

    const getType = () => {
        switch (type) {
            case 'demand':
                return 'poptávka'
            case 'listing':
                return 'nabídka'
            default:
                return ''
        }
    }

    const handleInputChange = (key, value) => {
        listingData[key] = value        
    }

    return (
        <CreatorContainer>
            <StyledCreator>            
                <CreatorHeading>NOVÁ {getType()}</CreatorHeading>
                <StyledInputRow>
                    <InputContainer fr="10" basis="100px">
                        <label for="name">Jméno</label>
                        <InputField name="name" type="text" maxLength="30" onChange={(event) => handleInputChange('name', event.target.value)} />
                    </InputContainer>
                    <InputContainer fr="1" basis="100px">
                        <label for="price">Cena</label>
                        <InputField name="price" type="number" onChange={(event) => handleInputChange('price', parseInt(event.target.value))} />
                    </InputContainer>
                </StyledInputRow>
                <TagRow>
                    <InputContainer>
                        <label for="tags">Tagy</label>
                        <TagsWrapper>
                            <TagsBlock></TagsBlock>
                            <InputField name="tags" type="text"/>
                        </TagsWrapper>                       
                    </InputContainer>
                </TagRow>
                <TextAreaContainer>
                    <label for="description">Popis</label>
                    <DescriptionInput name="description" rows="5" onChange={(event) => handleInputChange('description', event.target.value)} />
                </TextAreaContainer>
            </StyledCreator>
        </CreatorContainer>
    )
}

export default ListingCreator