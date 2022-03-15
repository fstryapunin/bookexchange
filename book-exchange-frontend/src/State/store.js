import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../User/userSlice'
import listingsReducer from '../Listings/listingsSlice'
import creatorReducer from '../User/Creator/CreatorSlice'
import filterReducer from '../Home/Filter/FilterSlice'
import { createSocketMiddleware } from './websocket'

export default configureStore({
  reducer: {        
    user: userReducer,
    listings: listingsReducer,
    creator: creatorReducer,
    filter: filterReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(createSocketMiddleware())
})