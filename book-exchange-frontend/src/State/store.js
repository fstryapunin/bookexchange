import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../User/userSlice'
import listingsReducer from '../Listings/listingsSlice'
import creatorReducer from '../User/Creator/CreatorSlice'
import { createSocketMiddleware } from './websocket'

export default configureStore({
  reducer: {        
    user: userReducer,
    listings: listingsReducer,
    creator: creatorReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(createSocketMiddleware())
})