import React from "react";
import { useSelector, useDispatch} from 'react-redux'
import { add, fetchCategories  } from '../State/categoriesSlice'
import styled from "styled-components";

const StyledHomepage = styled.div`
    max-width: 1140px;
    margin-left: auto;
    margin-right: auto;
    padding:25px;

`

const HomePage = () => {
    /*const categories = useSelector((state) => state.categories.data)
    const dispatch = useDispatch()
    dispatch(fetchCategories())*/
    
    return (
        <StyledHomepage>           
        </StyledHomepage>
    )
}

export default HomePage