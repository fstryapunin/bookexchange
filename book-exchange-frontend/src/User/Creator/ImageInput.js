import React, { useState, useEffect } from 'react'
import { AddIcon } from '../../Styles/GlobalIcons'
import PreviewImage from './PreviewImage'
import { uploadImages, setTitleImage } from './CreatorSlice';
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components'
const apiAdress = process.env.REACT_APP_API_ADRESS


const PreviewContainer = styled.div` 
    display: flex;
    flex-wrap: wrap;
    gap: 10px;       
`
const HeadingContainer = styled.div` 
    display: flex;
    gap:20px;
    flex-wrap: wrap;
    justify-content: space-between;
`
const StyledImageInput = styled.div` 
    margin-top: 20px; 
`
const FileInputSquare = styled.label` 
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 150px;
    border-radius: 5px;
    background-color: var(--medium-gray);
    overflow: hidden;
    cursor: pointer;  
`

const FileInputElement = styled.input` 
    visibility: hidden;
    position: absolute;   
    z-index: -1;
`

const WarningLabel = styled.label` 
    color: var(--error-red);
`

const AddImageIcon = styled(AddIcon)` 
    fill: var(--dark-blue);
`

const ImageInput = ({data}) => {    
    const [imagePreviews, updateImagePreviews] = useState([])    
    const [uiWarning, updateUiWarning] = useState({
        display: false,
        text: null
    })
    const dispatch = useDispatch()
    const images = useSelector(state => state.creator.images.uploads)    

    useEffect(() => {
        if (data) {            
            data.images.forEach(image => Object.assign(image, {name: image.file_name}))
            dispatch(setTitleImage(data.title))
            dispatch(uploadImages(data.images))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const checkUploads = (files) => {
        const checkForDuplicates = (list) => {
            const nameList = [...images.map(file => file.name), ...list.map(file => file.name)]
            for (const file of files) {
                let encountered = 0
                nameList.forEach(name => {
                    if(name === file.name) encountered++
                })                
                if (encountered > 1) {
                    return true
                }
            }            

            return false
        }

        if (images.length + files.length > 5) {
            return {
                isOk: false,
                error: 'Maximum pět fotografii'
            }
        }       

        files.forEach(file => {
            if (file.size > 5242880) {
                return ({
                    isOk: false,
                    error: 'Maximální velikost 5mb'
                })
            }            
        })

        const hasDuplicates = checkForDuplicates(files)
        
        if (hasDuplicates) {
            return {
                isOk: false,
                error: 'Žádné duplikátní fotografie'
            }
        }

        return {
            isOk: true,
            error: null
        }
    }

    const handleImageUpload = (event) => {
        
        const newFiles = Array.from(event.target.files)
        
        const uploadStatus = checkUploads(newFiles)

        if (uploadStatus.isOk) {
            //remove error message on succesful upload
            if (uiWarning.display) {
                updateUiWarning({
                    display: false,
                    text: null
                })
            }            
            dispatch(uploadImages(newFiles))            
        } else {
            updateUiWarning({
                display: true,
                text: uploadStatus.error
            })
        }
    }

    //generate new preview data when uploads change
    useEffect(() => {        
        const newPreviews = []

        const getImageSrc = (image) => {            
            if (image instanceof File) return URL.createObjectURL(image)
            else return  `${apiAdress}/public/uploads/${image.file_name}`
        }

        images.forEach(image => {            
            const previewObj = {
                name: image.name,
                src: getImageSrc(image)
            }            
            newPreviews.push(previewObj)       
         });
        updateImagePreviews(newPreviews)
    }, [images]) 
    
    //get preview elements
    const getPreviewImages = () => {     
        const previews = imagePreviews.map(previewObj => {
            return <PreviewImage key={previewObj.name} data={previewObj}/>
        })

        return previews
    }

    return (
        <StyledImageInput>
            <HeadingContainer>
                <label>Fotografie</label>
                {uiWarning.display ? <WarningLabel>{uiWarning.text}</WarningLabel> : null}
            </HeadingContainer>
            <PreviewContainer>
                {getPreviewImages()}
                <FileInputSquare key="file-input-146565614" htmlFor='listing-image-input'>
                    <AddImageIcon/>
                </FileInputSquare>
            </PreviewContainer>            
            <FileInputElement id="listing-image-input" type="file" multiple accept=".jpg,.jpeg,.png" onChange={handleImageUpload} />
        </StyledImageInput>
    )
}

export default ImageInput