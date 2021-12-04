import React, { useEffect } from 'react'
import Loader from '../Loader/Loader'
import CategoryPill from './CategoryPill'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCategories } from './categoriesSlice'

const Categories = () => {
    const categoriesStatus = useSelector((state) => state.categories.status)
    const categories = useSelector((state) => state.categories.data)  
    const dispatch = useDispatch()

    const getCategories = () => {
        if (categoriesStatus === 'idle') {
            dispatch(fetchCategories())
        }
    }
    
    useEffect(getCategories, [categoriesStatus, dispatch])

    const getCategoryElements = () => {
        const elements = categories.map(catObj => {
            return <CategoryPill key={catObj.id} data={catObj}/>        
        })
        return elements
    }

    
    if (categoriesStatus === 'loaded') {
        return (
            <>
                {getCategoryElements()}
            </>
        )
    } else if (categoriesStatus === 'loading' || 'idle'){
        return (
            <Loader/>
        )
    } else {
        return (
            <h2>
                Došlo k chybě
            </h2>
        )
    }
    
}

export default Categories

