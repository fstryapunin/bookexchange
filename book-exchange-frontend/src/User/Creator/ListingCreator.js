import React, {useState, useEffect} from "react";
import { SectionHeading, Card } from "../../Styles/GlobalStyles";
import { useLocation } from 'react-router-dom'
import { resetCreator } from "./CreatorSlice";
import { addUserListing, replaceUserListing } from "../userSlice";
import { addListing, replaceListing } from "../../Listings/listingsSlice";
import { useSelector, useDispatch } from "react-redux";
import ImageInput from "./ImageInput";
import { PrimaryButton, DisabledButton } from "../../Styles/GlobalStyles";
import { useNavigate } from "react-router-dom";
import ListingTag from "./ListingTag";
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
    flex-wrap: wrap;
`

const StyledDisabledButton = styled(DisabledButton)` 
    width: 100%;
    box-sizing: border-box;
    margin: 20px 0px 0px 0px;
`

const StyledAddButton = styled(PrimaryButton)` 
    width: 100%;
    box-sizing: border-box;
    margin: 20px 0px 0px 0px;
`

const EmptyTag = styled.p` 
    padding: 5px 10px;
    margin: 0px;
`

const apiAdress = process.env.REACT_APP_API_ADRESS

const ListingCreator = () => {
    const [listingName, updateListingName] = useState('')
    const [listingPrice, updateListingPrice] = useState('')
    const [listingDescription, updateListingDescription] = useState('')
    const [selectedTags, updateSelectedTags] = useState([])
    const [newTags, updateNewTags] = useState([])
    const [tagNameInput, updateTagNameInput] = useState('')    
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector(state => state.user.auth.token)
    const tagsStatus = useSelector(state => state.creator.tags.status)
    const tagsData = useSelector(state => state.creator.tags.loadedTags)
    const listingImages = useSelector(state => state.creator.images)
      
    const type = (location.state?.type || 'listing')
    const data = (location.state?.data || null)
    const isEdit = (location.state?.edit || false)

    //prefill if linked from edit button
    useEffect(() => {
        if (isEdit) {           
            updateListingName(data.name)
            updateListingPrice(data.price)
            updateListingDescription(data.description)
            updateSelectedTags(data.tags)
            
        }
        //reset creator when leaving page to prevent bugs with image input
        return () => {
            dispatch(resetCreator())
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEdit, data])
    
    const handleTagClick = (data, action, custom) => {
        if (action === 'select') {
            if (selectedTags.length + newTags.length < 5) {
                if (custom) {
                    const nextTags = [...newTags, data]
                    updateNewTags(nextTags)
                } else {
                    const nextTags = [...selectedTags, data]
                    updateSelectedTags(nextTags)
                }
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
                //remove selected tags from menu
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

                const tags = filteredTags.map(tagObj => {
                    return <ListingTag key={tagObj.id} data={tagObj} handleClick={handleTagClick} selected={false} cutsom={false}/>
                }) 
                
                //add custom tag if longer than 2 characters (no tags shorter than 2 chars)
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

    const handleTagInput = (event) => {
        const inputText = event.target.value
        if (inputText.charAt(inputText.length - 1) !== ' ' && inputText.length < 15) {
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
    
    const getEnableUpload = () => {
        const listingObj = {
            name: listingName,
            price: listingPrice,
            description: listingDescription,
            tags: [...selectedTags, ...newTags],            
            images: listingImages.uploads
        }      

        for (const property in listingObj) { 
            if (listingObj[property]) {
                if (listingObj[property].length === 0) return false
            } else return false
            
        }

        return true
    }

    const handleSuccessfulUpload = (data) => {
        dispatch(addListing(data))
        dispatch(addUserListing(data))
        dispatch(resetCreator())
        navigate('/success')
    }
    
    const handleCreateClick = async (event) => {
        event.preventDefault()
        if (!isEdit) {            
            const listingObj = {
                name: listingName,
                price: listingPrice,
                description: listingDescription,
                type: type,
                titleImage: listingImages.title
            }
        
            const newListing = new FormData()

            //append info to form data
            for (const property in listingObj) {
                newListing.append(property, listingObj[property])
            }

            newListing.append('tags', JSON.stringify(selectedTags))
            newListing.append('newTags', JSON.stringify(newTags))

            //apend each image to formdata
            listingImages.uploads.forEach(file => newListing.append('images', file))

            const response = await fetch(`${apiAdress}/listing/new`, {
                method: 'POST',
                headers: {
                    'x-access-token': token
                },
                body: newListing
            })
        
            if (response.ok) {
                const data = await response.json()
                handleSuccessfulUpload(data)
                
            } else {
                //navigate to error page here, clean up state
                dispatch(resetCreator())
                navigate('/error')
            }
        } else {            
            const listingInputs = {
                name: listingName,
                price: listingPrice,
                description: listingDescription,                
                title_image: listingImages.title
            }
            
            const updatedSimpleInputs = {
                id: data.id
            }        
            
            //check for changes and append to updated string inputs
            for (const property in listingInputs){
                if (listingInputs[property] !== data[property]) {
                    Object.assign(updatedSimpleInputs, {[property] : listingInputs[property]})
                }
            }

            const removedTags = []
            const assignedTags = []
            
            //check if selected tag is in old tags
            selectedTags.forEach(selectedTag => {
                const isOld = data.tags.some(oldTag => oldTag.id === selectedTag.id)
                if (!isOld) {
                    assignedTags.push(selectedTag)
                }
            })

            //check if any old tags where removed
            data.tags.forEach(oldTag => {
                const stillExists = selectedTags.some(newTag => newTag.id === oldTag.id)
                if (!stillExists) {
                    removedTags.push(oldTag)
                }
            })

            const newImages = []
            const removedImages  = []
            
            //add newUploads to new images
            listingImages.uploads.forEach(upload => {
                if (upload instanceof File) {
                    newImages.push(upload)
                }
            })

            data.images.forEach(oldImage => {
                const stillExists = listingImages.uploads.some(upload => oldImage.file_name === upload.file_name)
                if (!stillExists) {
                    removedImages.push(oldImage)
                }
            })

            const updatedListing = new FormData()
            
            //append simple info to form data
            if (Object.keys(updatedSimpleInputs).length > 0) {
                updatedListing.append('info', JSON.stringify(updatedSimpleInputs))
            }

            if (newTags.length > 0) {
                updatedListing.append('newTags', JSON.stringify(newTags))
            }
            if (assignedTags.length > 0) {
                updatedListing.append('assignedTags', JSON.stringify(assignedTags))
            }
            if (removedTags.length > 0) {
                updatedListing.append('removedTags', JSON.stringify(removedTags))
            }
            if (newImages.length > 0) {
                newImages.forEach(image => {
                    updatedListing.append('newImages', image)
                })
            }
            if (removedImages.length > 0) {
                updatedListing.append('removedImages', JSON.stringify(removedImages))
            }

            const response = await fetch(`${apiAdress}/listing/edit`, {
                method: 'POST',
                headers: {
                    'x-access-token': token
                },
                body: updatedListing
            })

            if (response.ok) {
                const data = await response.json()
                console.log(data)
                dispatch(replaceListing(data[0]))
                dispatch(replaceUserListing(data[0]))
                dispatch(resetCreator())
                navigate('/success')
            } else {
                dispatch(resetCreator())
                navigate('/error')
            }
        }
    }

    const handleNameChange = (event) => {
        const newName = event.target.value
        if (newName.length < 40) {
            updateListingName(newName)
        }
    }

    const handlePriceChange = (event) => {
        const re = /^[0-9\b]+$/;   
        if (event.target.value === '' || re.test(event.target.value)) {
           updateListingPrice(event.target.value)
        } else {
            event.preventDefault()
        }
           
    }

    const handleDescriptionChange = (event) => {
        const value = event.target.value
        if (value.length < 1000) {
            updateListingDescription(value)
        }
    }   

    const getTitleText = () => {
        const getEditType = () => {
            switch (type) {
                case 'demand':
                    return 'poptávku'
                case 'listing':
                    return 'nabídku'
                default:
                    return ''
            }
        }
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

        if (isEdit) {
            return `UPRAVIT ${getEditType()}`
        }
        else return `NOVÁ ${getType()}`
    }

    const getButtonText = () => {        
        if (isEdit) return 'Upravit'
        else return 'Přidat'
    }
    
    const getImageData = () => {
        if (isEdit) {
            return {
                images: data.images,
                title: data.title_image
            }
        }
        else return null
    }

    return (
        <CreatorContainer>
            <StyledCreator>            
                <CreatorHeading>{getTitleText()}</CreatorHeading>
                <form onSubmit={handleCreateClick}>
                <StyledInputRow>
                    <InputContainer fr="10" basis="100px">
                        <label htmlFor="name">Název</label>
                        <InputField value={listingName} name="name" type="text" autoComplete="off" onChange={handleNameChange} />
                    </InputContainer>
                    <InputContainer fr="1" basis="100px">
                        <label htmlFor="price">Cena</label>
                        <InputField value={listingPrice} name="price" type="number" autoComplete="off" onChange={handlePriceChange} />
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
                    <DescriptionInput name="description" rows="5" autoComplete="off" value={listingDescription} onChange={handleDescriptionChange} />
                </TextAreaContainer>                
                    <ImageInput data={getImageData()} preFill={isEdit}/>               
                    {getEnableUpload() ? <StyledAddButton type='submit'><p>{getButtonText()}</p></StyledAddButton> : <StyledDisabledButton onClick={e => e.preventDefault()} ><p>{getButtonText()}</p></StyledDisabledButton>}
                </form>
            </StyledCreator>
        </CreatorContainer>
    )
}

export default ListingCreator