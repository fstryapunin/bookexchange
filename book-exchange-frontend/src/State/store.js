import { configureStore } from '@reduxjs/toolkit'
import categoriesReducer from '../Categories/categoriesSlice'
import userReducer from '../User/userSlice'
import listingsReducer from '../Listings/listingsSlice'

export default configureStore({
  reducer: {
      categories: categoriesReducer,      
      user: userReducer,
      listings: listingsReducer
    },
})