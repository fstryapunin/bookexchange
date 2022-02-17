import React, { useState, useEffect } from 'react'
import { AddIcon } from '../../Styles/GlobalIcons'
import PreviewImage from './PreviewImage'
import styled from 'styled-components'

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

const ImageInput = () => {
    const [imageUploads, updateImageUploads] = useState([])
    const [imagePreviews, updateImagePreviews] = useState([])
    const [currentMainImageName, updateCurrentMainName] = useState(null)
    const [uiWarning, updateUiWarning] = useState({
        display: false,
        text: null
    })

    const checkUploads = (files) => {
        const checkForDuplicates = (list) => {
            const nameList = [...imageUploads.map(file => file.name), ...list.map(file => file.name)]
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

        if (imageUploads.length + files.length > 5) {
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

            const newUploaded = [...imageUploads, ...newFiles]

            if (!currentMainImageName) {
                updateCurrentMainName(newFiles[0].name)
            }
            updateUiWarning({
                display: false,
                text: null
            })
            updateImageUploads(newUploaded)
        } else {
            updateUiWarning({
                display: true,
                text: uploadStatus.error
            })
        }
    }

    useEffect(() => {        
        if (imageUploads.length === 0) {            
            updateCurrentMainName(null)
        }

        const newPreviews = []
        imageUploads.forEach(image => {
            const previewObj = {
                name: image.name,
                src: URL.createObjectURL(image)
            }
            
            newPreviews.push(previewObj)
        });

        updateImagePreviews(newPreviews)

    }, [imageUploads])

    useEffect(() => {       
        if (!currentMainImageName && imageUploads.length > 0) {              
            updateCurrentMainName(imageUploads[0].name)
        }
    }, [currentMainImageName, imageUploads])
    
    const getPreviewImages = () => {
        
        const checkIfMain = (name) => {           
            if (name === currentMainImageName) return true
            else return false
        }

        const previews = imagePreviews.map(previewObj => {
            return <PreviewImage key={previewObj.name} data={previewObj} isMain={checkIfMain(previewObj.name)} onClick={handleMainIdUpdate} onDelete={handleImageDeletion}/>
        })

        return previews
    }
    
    const handleMainIdUpdate = (name) => {
        if (name !== currentMainImageName) {            
            updateCurrentMainName(name)
        }
    }

    const handleImageDeletion = (name) => {       
        const newUploads = imageUploads.filter(imageFile => imageFile.name !== name)
        updateImageUploads(newUploads)

        if (name === currentMainImageName) {            
            updateCurrentMainName(null)
        }
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