import React, {useState, useEffect} from "react";
import { Card, SectionHeading, DisabledButton, PrimaryButton, SecondaryButton } from "../../Styles/GlobalStyles";
import ListingTag from "../../User/Creator/ListingTag";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const StyledNameInput = styled.input` 
    height: 30px;
    box-sizing: border-box;
`
const StyledTagInput = styled(StyledNameInput)` 
   
`
const StyledControlRow = styled.div` 
    display: flex;
    justify-content: space-between;
`

const StyledFilterRow = styled.div` 
    display: flex;
    gap: 10px;
`
const StyledPriceInputContainer = styled.div` 
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
`
const StyledTagInputContainer = styled.div` 
    display: flex;
    align-items: center;
    margin-top: 10px;
`
const StyledControlButton = styled(SecondaryButton)` 
    height: 30px;
    margin: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: none;
`

const StyledFilterButton = styled(PrimaryButton)` 
    height: 30px;
    margin: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
`
const StyledPriceInput = styled(StyledNameInput)` 
    max-width: 3rem;
`
const StyledCancelButton = styled(StyledControlButton)` 
    margin-left: auto;
`
const StyledTagContainer = styled.div`
    margin-top: 10px; 
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
`
const StyledTagMenu = styled.div` 
    display: flex;
    flex-direction: column;
    position: relative;
`
const StyledTagList = styled.div`     
    display: flex;
    flex-direction: column;
    background-color: var(--light-gray);
    position: absolute;    
    max-height: 400px;
    overflow-y: auto;
    top: 30px;
    left: 0;
    right: 0;
    padding: 5px 0px;  
`
const EmptyTag = styled.p` 
    padding: 5px 10px;
    margin: 0px;
`

const FilterControl = () => {
    const [nameInput, updateNameInput] = useState('')
    const [selectedTags, updateSelectedTags] = useState([])
    const [tagName, updateTagName] = useState('')
    const tagsStatus =  useSelector(state => state.filter.tags.loadedTags)
    const tagsData = useSelector(state => state.filter.tags.loadedTags)
    const dispatch = useDispatch()    

    const handleNameInput = (event) => {
        const value = event.target.value
        if (value.length < 50) {
            updateNameInput(event.target.value)
        }
    }

    const handleTagNameInput = (event) => {
        const inputText = event.target.value
        if (inputText.charAt(inputText.length - 1) !== ' ') {
            updateTagName(event.target.value)
            dispatch({
                type: 'GET_WEBSOCKET_TAGS',
                payload: event.target.value
            })
        }
    }

    const handleSelectTag = (data) => {
        updateSelectedTags([...selectedTags, data])
    }

    const handleDeselectTag = (data) => {
        const newTags = selectedTags.filter(tagObj => tagObj.id !== data.id)
        updateSelectedTags(newTags)
    }

    const getTagMenuElements = () => {
        if (tagsStatus === 'loaded' || 'loading') {
            const filteredTags = tagsData.filter(tagObj => {
                let selected = false
                selectedTags.forEach(selectedTag => {                            
                        if (selectedTag.id === tagObj.id) {
                            selected = true
                        }
                })                    
                return !selected
                }                                        
            )                               

            const elements = filteredTags.map(tagObj => <ListingTag key={tagObj.id} data={tagObj} selected={false} handleClick={handleSelectTag} />)
            if(elements.length > 0) return elements
            else return <EmptyTag>Žádné tagy</EmptyTag>
        }       
    }
    
    const getSelectedTagElements = () => {
        const elements = selectedTags.map(tagObj => <ListingTag key={tagObj.id} data={tagObj} selected={true} handleClick={handleDeselectTag} />)
        return elements
    }

    const handleTagInputBlur = (event) => {
        //only blur if clicked outside parent input div        
        if (!event.currentTarget.contains(event.relatedTarget)) {
            updateTagName('')
            dispatch({
                type: 'GET_WEBSOCKET_TAGS',
                payload: ''
            })
        }        
    }

    return (
        <Card>
            <StyledControlRow>
                <StyledFilterRow>
                    <StyledNameInput placeholder="Název" value={nameInput} onChange={handleNameInput} />
                    <StyledFilterButton>CENA</StyledFilterButton>
                    <StyledFilterButton>TAGY</StyledFilterButton>
                </StyledFilterRow>
                <StyledFilterRow>  
                    <StyledControlButton>HLEDAT</StyledControlButton>
                    <StyledControlButton>ZRUŠIT</StyledControlButton>
                </StyledFilterRow>                
            </StyledControlRow>
            <StyledPriceInputContainer>
                    <p>Od:</p>
                    <StyledPriceInput/>
                    <p>do:</p>
                    <StyledPriceInput />
                    <p>Kč</p>
                    <StyledCancelButton>ZRUŠIT</StyledCancelButton>
            </StyledPriceInputContainer>
            <StyledTagInputContainer >
                    <StyledTagMenu tabIndex="0" onBlur={(event) => handleTagInputBlur(event)}>
                        <StyledTagInput placeholder="tagy" autoComplete="off" value={tagName} onChange={handleTagNameInput} />
                        {tagName.length> 0 ? <StyledTagList>
                            {getTagMenuElements()}
                        </StyledTagList> : null}
                    </StyledTagMenu>
                    <StyledCancelButton>ZRUŠIT</StyledCancelButton>
            </StyledTagInputContainer>
            {selectedTags.length > 0 ? <StyledTagContainer>
                {getSelectedTagElements()}
            </StyledTagContainer> : null}
        </Card>
    )
}

export default FilterControl