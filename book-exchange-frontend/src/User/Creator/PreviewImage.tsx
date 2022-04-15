import React from "react";
import { MediumDeleteIcon } from "../../Styles/GlobalIcons";
import { setTitleImage, removeImage } from "./CreatorSlice";
import { useAppSelector, useAppDispatch } from "../../Hooks/hooks";
import styled from "styled-components";

interface WProps {
    active: any
}

const PreviewImageWrapper = styled.div<WProps>`
    width: 150px;
    height: 150px;
    border-radius: 5px;
    background-color: var(--medium-gray);
    overflow: hidden;    
    cursor: ${props => props.active ? 'pointer' : 'auto'};
    position: relative;
`
const StyledPreviewImage = styled.img` 
    width: 150px;
    height: 150px;    
    object-fit: contain;
`

const DeleteIcon = styled(MediumDeleteIcon)` 
    position: absolute;
    right: 5px;
    top: 5px;
    fill: var(--dark-blue);
`

const TitleText = styled.p`     
    position: absolute;
    bottom: 0px;
    right: 0px;
    left: 0px;
    padding: 10px 5px;
    margin: 0px;
    text-align:center;
    color: var(--dark-blue);
    text-transform: uppercase;
    font-weight: bold;
    background-color: var(--medium-gray);    
`

interface IProps {
    data: {
        name: string,
        src: string,
    }
}

const PreviewImage: React.FC<IProps> = ({ data }) => {
    const dispatch = useAppDispatch()
    const titleImage = useAppSelector(state => state.creator.images.title)    
    
    return (
        <PreviewImageWrapper active={titleImage !== data.name ? true : false} onClick={() => dispatch(setTitleImage(data.name))}>
            <StyledPreviewImage src={data.src} />
            <DeleteIcon onClick={(event) => {
                event.stopPropagation()
                dispatch(removeImage(data))
            }} />
            {titleImage === data.name ? <TitleText>Titulní obrázek</TitleText> : null}
        </PreviewImageWrapper>
    )
}

export default PreviewImage