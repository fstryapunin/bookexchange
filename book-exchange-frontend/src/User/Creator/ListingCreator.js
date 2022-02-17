import React, {useState} from "react";
import { SectionHeading, Card } from "../../Styles/GlobalStyles";
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import ImageInput from "./ImageInput";
import styled from "styled-components";
import ListingTag from "./ListingTag";

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
    display: flex;
    flex-direction: column;
    background-color: var(--light-gray);
    position: absolute;
    right: 0;
    left: 0;
    max-height: 400px;
    overflow-y: auto;
    padding: 5px 0px;    
`
const TagsWrapper = styled.div` 
    position: relative;    
`
const SelectedTags = styled.div` 
    display: flex;
    align-items: flex-end;
    gap: 10px;
`

const EmptyTag = styled.p` 
    padding: 5px 10px;
    margin: 0px;
`

const ListingCreator = () => {
    const [selectedTags, updateSelectedTags] = useState([])
    const [newTags, updateNewTags] = useState([])
    const [tagNameInput, updateTagNameInput] = useState('')
    const listingData = {
        name: '',
        description: '',
        tags: [],
        price: 0
    }
    const location = useLocation();
    const dispatch = useDispatch();
    const tagsStatus = useSelector(state => state.creator.status)
    const tagsData = useSelector(state => state.creator.loadedTags)
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
    
    const handleTagClick = (data, action, custom) => {
        if (action === 'select') {
            if (custom) { 
                const nextTags = [...newTags, data]
                updateNewTags(nextTags)
            } else {
                const nextTags = [...selectedTags, data]
                updateSelectedTags(nextTags)
            }
        } else if (action === 'remove') {
            if (custom) {
                const nextTags = newTags.filter(newTag => newTag.text !== data.text)
                updateNewTags(nextTags)
            } else {
                const nextTags = selectedTags.filter(selectedTag => selectedTag.id !== data.id)
                updateSelectedTags(nextTags)
            }
        }
    }    

    const getTagElements = (type) => {
        if (type === 'menu') {
            if (tagsStatus === 'loaded' || 'loading') {
                const filteredTags = tagsData.filter(tagObj => {
                    let selected = false
                    selectedTags.forEach(selectedTag => {                            
                            if (selectedTag.id === tagObj.id) {
                                selected = true
                            }
                    })
                    if(!selected) return tagObj
                    }                    
                )                               

                const tags = filteredTags.map(tagObj => {
                    return <ListingTag key={tagObj.id} data={tagObj} handleClick={handleTagClick} selected={false} cutsom={false}/>
                }) 
                
                if (tagNameInput.length > 2) {
                    let showCustomTag = true;
                    tagsData.forEach(tagObj => {
                        if (tagObj.text.toUpperCase() === tagNameInput.toUpperCase()) showCustomTag = false;
                    })

                    newTags.forEach(tagObj => {
                        if (tagObj.text.toUpperCase() === tagNameInput.toUpperCase()) showCustomTag = false;
                    })

                    if (showCustomTag) {
                        tags.push(<ListingTag key={tagNameInput} data={{text: tagNameInput}} handleClick={handleTagClick} selected={false} custom={true}/>)
                    }
                    
                }
                
                if (tags.length === 0) {
                    return <EmptyTag>Žádné dostupné tagy</EmptyTag>
                }

                return tags
            }
        } else if (type === 'selected') {
            const tags = []
                
            selectedTags.forEach(tagObj => {
                tags.push(<ListingTag key={tagObj.id} data={tagObj} handleClick={handleTagClick} selected={true} custom={false}/>)
            })

            newTags.forEach(tagObj => {
                tags.push(<ListingTag key={tagObj.text} data={tagObj} handleClick={handleTagClick} selected={true} custom={true}/>)
            })            

            return tags
        }
    }

    const handleInputChange = (key, value) => {
        listingData[key] = value        
    }

    const handleTagInput = (event) => {
        const inputText = event.target.value
        if (inputText.charAt(inputText.length - 1) !== ' ') {
            updateTagNameInput(event.target.value)
            dispatch({
                type: 'GET_WEBSOCKET_TAGS',
                payload: event.target.value
            })
        }
    }

    const handleTagInputBlur = (event) => {
        //only blur if clicked outside parent input div
        if (!event.currentTarget.contains(event.relatedTarget)) {
            updateTagNameInput('')
            dispatch({
                type: 'GET_WEBSOCKET_TAGS',
                payload: ''
            })
        }        
    }    

    return (
        <CreatorContainer>
            <StyledCreator>            
                <CreatorHeading>NOVÁ {getType()}</CreatorHeading>
                <StyledInputRow>
                    <InputContainer fr="10" basis="100px">
                        <label htmlFor="name">Jméno</label>
                        <InputField name="name" type="text" maxLength="30" autoComplete="off" onChange={(event) => handleInputChange('name', event.target.value)} />
                    </InputContainer>
                    <InputContainer fr="1" basis="100px">
                        <label htmlFor="price">Cena</label>
                        <InputField name="price" type="number" autoComplete="off" onChange={(event) => handleInputChange('price', parseInt(event.target.value))} />
                    </InputContainer>
                </StyledInputRow>
                <TagRow tabIndex="0" onBlur={(event) => handleTagInputBlur(event)}>                    
                    <InputContainer >                        
                        <label htmlFor="tags">Tagy</label>
                        <TagsWrapper>                            
                            <InputField name="tags" type="text" autoComplete="off" value={tagNameInput} onChange={(event) => handleTagInput(event)}/>
                            {tagNameInput.length > 0 ? <TagsBlock id="tag-menu">{getTagElements('menu')}</TagsBlock> : null}                            
                        </TagsWrapper>                       
                    </InputContainer>
                    <SelectedTags>{getTagElements('selected')}</SelectedTags>
                </TagRow>                
                <TextAreaContainer>
                    <label htmlFor="description">Popis</label>
                    <DescriptionInput name="description" rows="5" autoComplete="off" onChange={(event) => handleInputChange('description', event.target.value)} />
                </TextAreaContainer>
                <ImageInput/>
            </StyledCreator>
        </CreatorContainer>
    )
}

export default ListingCreator