import React, { useState } from "react";
import { fetchFilteredListings, fetchListings } from "../../Listings/listingsSlice";
import { Card, PrimaryButton, SecondaryButton } from "../../Styles/GlobalStyles";
import useCheckMobileScreen from "../../Hooks/useCheckMobile";
import ListingTag from "../../User/Creator/ListingTag";
import { useAppSelector, useAppDispatch } from "../../Hooks/hooks";
import styled from "styled-components";

const StyledInput = styled.input` 
    height: 30px;
    box-sizing: border-box;
`

const StyledNameInput = styled(StyledInput)` 
   min-width: 130px;   
   @media(max-width : 439px){
        box-sizing: border-box;
        width: 100%;
    } 
`
const StyledFilterControl = styled(Card)` 
    margin-bottom: 25px;
`

const StyledSearchBarContainerMobile = styled(Card)` 
    display: flex;
    justify-content: space-between;  
    flex-wrap: wrap;  
    gap: 10px;
`
const StyledSearchBarButtonContainer = styled.div` 
    display: flex;
    gap: 10px;
    > button {
        flex-grow: 1;
    }
    @media(max-width : 439px){
        box-sizing: border-box;
        width: 100%;
    }
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

const StyledFilterButtonMobile = styled(StyledControlButton)` 
    width: 100%;
    box-sizing: border-box;
    margin: 20px 0px;
`

const StyledFilterButton = styled(PrimaryButton)` 
    height: 30px;
    margin: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
`
const StyledPriceInput = styled(StyledInput)` 
    max-width: 5rem;
`
const StyledCancelButton = styled(StyledControlButton)` 
    margin-left: auto;
`
const StyledTagContainer = styled.div`
    margin-top: 10px; 
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
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
const StyledFilterModalContainer = styled.div` 
    background-color: rgba(255,255,255, 0.5);
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
`
const StyledFilterModal = styled.div` 
    background-color: white;
    position: fixed;
    top:0;
    left: 0;    
    bottom: 0;
    padding: 20% 25px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`
const StyledSelect = styled.select` 
    display: block;
    width: 170px;
    box-sizing: border-box;
    height: 30px;
    margin: 10px 0px;
`
const StyledPriceInputMobiled = styled.div` 
    display: flex;
    gap: 5px;
    align-items: center;
`
const StyledTagContainerMobile = styled.div`     
    margin-top: 10px; 
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
`

const StyledModalButtonContainer = styled.div` 
    width: 100%;
    margin-top: auto;
    display: flex;
    box-sizing: border-box;    
    gap: 10px;
    > button {
        flex-grow: 1;
    }
`

const StyledModalInputBlock = styled.div` 
    > input, select, div {
        box-sizing: border-box;
        width: 100%;
    }
`

const defaultMinPrice = 0
const defaultMaxPrice = 1000

const FilterControl: React.FC = () => {
    const [displayModal, updateDisplayModal] = useState<boolean>(false)
    const [nameInput, updateNameInput] = useState<string>('')
    const [priceMin, updatePriceMin] = useState<string | number>(defaultMinPrice)
    const [priceMax, updatePriceMax] = useState<string | number>(defaultMaxPrice)
    const [listingType, updateType] = useState<string>('all')
    const [selectedTags, updateSelectedTags] = useState<Tag[]>([])
    const [displayPriceFilter, updateDisplayPrice] = useState<boolean>(false)
    const [displayTagsFilter, updateDisplayTags] = useState<boolean>(false)
    const [tagName, updateTagName] = useState<string>('')
    const tagsStatus =  useAppSelector(state => state.filter.tags.status)
    const tagsData = useAppSelector(state => state.filter.tags.loadedTags)
    const isFiltered = useAppSelector(state => state.listings.homepage.filtered)
    const isMobile = useCheckMobileScreen()
    const dispatch = useAppDispatch()    

    const handleNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (value.length < 50) {
            updateNameInput(event.target.value)
        }
    }

    const handleTagNameInput = (event : React.ChangeEvent<HTMLInputElement>) => {
        const inputText = event.target.value
        if (inputText.charAt(inputText.length - 1) !== ' ') {
            updateTagName(event.target.value)
            dispatch({
                type: 'GET_WEBSOCKET_TAGS',
                payload: event.target.value
            })
        }
    }

    const handleSelectTag = (data: Tag) => {
        if (selectedTags.length < 5) {
            const newArr = [...selectedTags, data]
            updateSelectedTags(newArr)
        }
    }

    const handleDeselectTag = (data: Tag) => {
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

    const handleTagInputBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        //only blur if clicked outside parent input div        
        if (!event.currentTarget.contains(event.relatedTarget)) {
            updateTagName('')
            dispatch({
                type: 'GET_WEBSOCKET_TAGS',
                payload: ''
            })
        }        
    }

    const handlePriceInput = (value: number, type: string) => {        
        switch (type) {
            case 'min':
                if (isNaN(value)) {
                    console.log('here')
                    updatePriceMin('')
                    break;
                }
                if (value > 0) {
                    
                    updatePriceMin(value)
                }
                break;
            case 'max':
                if (isNaN(value)) {
                    updatePriceMax('')
                    break;
                }
                if (value > 0) {                   
                    updatePriceMax(value)
                }
                break;
            default:
                break;
        }            
    }

    const handleOpenModalClick = () => {
        //prevent scrolling
        document.body.style.overflow = 'hidden';
        updateDisplayModal(true)
    }

    const handleCloseModalClick = () => {
        document.body.style.overflow = 'unset';
        updateDisplayModal(false)
    }

    const handleCancelClick = () => {
        updateDisplayPrice(false)
        updatePriceMin(defaultMinPrice)
        updatePriceMax(defaultMaxPrice)
        updateDisplayTags(false)
        updateSelectedTags([])
        updateNameInput('')
        updateType('all')
        updateDisplayModal(false)
        //dispatch fetch unfiltered listings
        if (isFiltered) {
            dispatch(fetchListings(0))
        }
        document.body.style.overflow = 'unset';
    }

    const handleSearchClick = () => {

        //construct filters object
        const filters = {}

        if (nameInput.length > 0) {
            Object.assign(filters, { name: nameInput})
        }
        if(listingType !== 'all'){ Object.assign(filters, { type: listingType }) }
        if (displayPriceFilter && (parseInt(priceMin as string) > 0 || parseInt(priceMax as string) > 0)) {
            Object.assign(filters, {
                price: {
                    min: priceMin,
                    max: priceMax
                }
            })
        }
        if (selectedTags.length > 0) {
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

    if(!isMobile){
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
                    <StyledPriceInput type="number" value={priceMin} onChange={event => handlePriceInput(parseInt(event.target.value), 'min')}/>
                    <p>do:</p>
                    <StyledPriceInput type="number" value={priceMax} onChange={event => handlePriceInput(parseInt(event.target.value), 'max')}/>
                    <p>Kč</p>
                    <StyledCancelButton onClick={() => { updateDisplayPrice(false); updatePriceMin(defaultMinPrice); updatePriceMax(defaultMaxPrice) }}>ZRUŠIT</StyledCancelButton>
                </StyledPriceInputContainer> : null}
            {displayTagsFilter? <StyledTagInputContainer >
                    <StyledTagMenu tabIndex={0} onBlur={(event) => handleTagInputBlur(event)}>
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
    } else {
        return (
            <>
                
                <StyledSearchBarContainerMobile>
                    <StyledNameInput placeholder="Název" value={nameInput} onChange={handleNameInput} />
                    <StyledSearchBarButtonContainer>
                        <StyledControlButton onClick={handleSearchClick}>HLEDAT</StyledControlButton>
                        {isFiltered ? <StyledControlButton onClick={handleCancelClick}>ZRUŠIT</StyledControlButton> : null}
                    </StyledSearchBarButtonContainer>
                </StyledSearchBarContainerMobile>               
                <StyledFilterButtonMobile onClick={handleOpenModalClick}>UPŘESNIT</StyledFilterButtonMobile>
                {displayModal ?
                    <StyledFilterModalContainer onClick={handleCloseModalClick} >
                        <StyledFilterModal onClick={event => event.stopPropagation()}>
                            <StyledModalInputBlock>
                            <StyledNameInput placeholder="Název" value={nameInput} onChange={handleNameInput} />
                            <StyledSelect value={listingType} onChange={(event) => updateType(event.target.value)}>
                                <option value="all">Všechno</option>
                                <option value="listing">Nabídka</option>
                                <option value="demand">Poptávka</option>
                            </StyledSelect>
                            <StyledPriceInputMobiled>
                                <p>Od:</p>
                                <StyledPriceInput type="number" value={priceMin} onChange={event => handlePriceInput(parseInt(event.target.value), 'min')}/>
                                <p>do:</p>
                                <StyledPriceInput type="number" value={priceMax} onChange={event => handlePriceInput(parseInt(event.target.value), 'max')}/>
                                <p>Kč</p>
                            </StyledPriceInputMobiled>
                            <StyledTagInputContainer >
                                <StyledTagMenu tabIndex={0} onBlur={(event) => handleTagInputBlur(event)}>
                                    <StyledTagInput placeholder="tagy" autoComplete="off" value={tagName} onChange={handleTagNameInput} />
                                    {tagName.length > 0 ? <StyledTagList>
                                        {getTagMenuElements()}
                                    </StyledTagList> : null}
                                </StyledTagMenu>                            
                                </StyledTagInputContainer>
                                {selectedTags.length > 0 ?
                                    <StyledTagContainerMobile>
                                        {getSelectedTagElements()}
                                    </StyledTagContainerMobile> : null}
                            </StyledModalInputBlock>
                            <StyledModalButtonContainer>
                                <StyledControlButton onClick={handleSearchClick}>HLEDAT</StyledControlButton>
                                {isFiltered? <StyledControlButton onClick={handleCancelClick}>ZRUŠIT</StyledControlButton> : null}
                            </StyledModalButtonContainer>
                        </StyledFilterModal>                        
                    </StyledFilterModalContainer> : null}
            </>
        )
    }

}

export default FilterControl