import { configureStore } from '@reduxjs/toolkit'
import categoriesReducer from '../Categories/categoriesSlice'
import authReducer from './authSlice'
import userReducer from './userSlice'


export default configureStore({
  reducer: {
      categories: categoriesReducer,
      auth: authReducer,
      user: userReducer
    },
})