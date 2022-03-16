import React, { useState, useEffect } from "react";
import { fetchFilteredListings, fetchListings } from "../../Listings/listingsSlice";
import { Card, SectionHeading, DisabledButton, PrimaryButton, SecondaryButton } from "../../Styles/GlobalStyles";
import ListingTag from "../../User/Creator/ListingTag";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const StyledNameInput = styled.input` 
    height: 30px;
    box-sizing: border-box;
`
const StyledFilterControl = styled(Card)` 
    margin-bottom: 25px;
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
    max-width: 5rem;
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
    z-index: 2;
`
const EmptyTag = styled.p` 
    padding: 5px 10px;
    margin: 0px;
`

const defaultMinPrice = 0
const defaultMaxPrice = 1000

const FilterControl = () => {
    const [nameInput, updateNameInput] = useState('')
    const [priceMin, updatePriceMin] = useState(defaultMinPrice)
    const [priceMax, updatePriceMax] = useState(defaultMaxPrice)
    const [listingType, updateType] = useState('all')
    const [selectedTags, updateSelectedTags] = useState([])
    const [displayPriceFilter, updateDisplayPrice] = useState(false)
    const [displayTagsFilter, updateDisplayTags] = useState(false)
    const [tagName, updateTagName] = useState('')
    const tagsStatus =  useSelector(state => state.filter.tags.loadedTags)
    const tagsData = useSelector(state => state.filter.tags.loadedTags)
    const isFiltered = useSelector(state => state.listings.homepage.filtered)    
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

    const handlePriceInput = (value, type) => {
        switch (type) {
            case 'min':
                if (value > 0) {
                    updatePriceMin(value)
                }
                break;
            case 'max':
                if (value > 0) {
                    updatePriceMax(value)
                }
                break;
            default:
                break;
        }            
    }

    const handleCancelClick = () => {
        updateDisplayPrice(false)
        updatePriceMin(defaultMinPrice)
        updatePriceMax(defaultMaxPrice)
        updateDisplayTags(false)
        updateSelectedTags([])
        updateNameInput('')
        updateType('all')
        //dispatch fetch unfiltered listings
        if (isFiltered) {
            dispatch(fetchListings(0))
        }
    }

    const handleSearchClick = () => {

        //construct filters object
        const filters = {}

        if (nameInput.length > 0) {
            Object.assign(filters, { name: nameInput})
        }
        if(listingType !== 'all'){ Object.assign(filters, { type: listingType }) }
        if (displayPriceFilter && (priceMin !== 0 || priceMax !== 1000)) {
            Object.assign(filters, {
                price: {
                    min: priceMin,
                    max: priceMax
                }
            })
        }
        if (displayTagsFilter && selectedTags.length > 0) {
            Object.assign(filters, {tags : selectedTags})
        }

        //disptach request for filtered listings if any filters are present
        if (Object.keys(filters).length > 0) {
            dispatch(fetchFilteredListings(filters))
        } else {
            //handle manual filter reset if filtered else do nothing
            if (isFiltered) {
                dispatch(fetchListings(0))
            }
        }        
    }

    return (
        <StyledFilterControl>
            <StyledControlRow>
                <StyledFilterRow>
                    <StyledNameInput placeholder="Název" value={nameInput} onChange={handleNameInput} />
                    <select value={listingType} onChange={(event) => updateType(event.target.value)}>
                        <option value="all">Všechno</option>
                        <option value="listing">Nabídka</option>
                        <option value="demand">Poptávka</option>
                    </select>
                    <StyledFilterButton onClick={() => updateDisplayPrice(true)}>CENA</StyledFilterButton>
                    <StyledFilterButton onClick={() => updateDisplayTags(true)}>TAGY</StyledFilterButton>
                </StyledFilterRow>
                <StyledFilterRow>  
                    <StyledControlButton onClick={handleSearchClick}>HLEDAT</StyledControlButton>
                    <StyledControlButton onClick={handleCancelClick}>ZRUŠIT</StyledControlButton>
                </StyledFilterRow>                
            </StyledControlRow>
            {displayPriceFilter ?
                <StyledPriceInputContainer>
                    <p>Od:</p>
                    <StyledPriceInput type="number" value={priceMin} onChange={event => handlePriceInput(event.target.value, 'min')}/>
                    <p>do:</p>
                    <StyledPriceInput type="number" value={priceMax} onChange={event => handlePriceInput(event.target.value, 'max')}/>
                    <p>Kč</p>
                    <StyledCancelButton onClick={() => { updateDisplayPrice(false); updatePriceMin(defaultMinPrice); updatePriceMax(defaultMaxPrice) }}>ZRUŠIT</StyledCancelButton>
                </StyledPriceInputContainer> : null}
            {displayTagsFilter? <StyledTagInputContainer >
                    <StyledTagMenu tabIndex="0" onBlur={(event) => handleTagInputBlur(event)}>
                        <StyledTagInput placeholder="tagy" autoComplete="off" value={tagName} onChange={handleTagNameInput} />
                        {tagName.length > 0 ? <StyledTagList>
                            {getTagMenuElements()}
                        </StyledTagList> : null}
                    </StyledTagMenu>
                <StyledCancelButton onClick={() => { updateDisplayTags(false);  updateSelectedTags([])}}>ZRUŠIT</StyledCancelButton>
                </StyledTagInputContainer> : null}
            {selectedTags.length > 0 ? <StyledTagContainer>
                {getSelectedTagElements()}
            </StyledTagContainer> : null}
        </StyledFilterControl>
    )
}

export default FilterControl