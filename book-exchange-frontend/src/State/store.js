import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../User/userSlice'
import listingsReducer from '../Listings/listingsSlice'
import creatorReducer from '../User/Creator/CreatorSlice'
import filterReducer from '../Home/Filter/FilterSlice'
import messagesReducer from '../Messages/messagesSlice'
import { createSocketMiddleware } from './websocket'

export default configureStore({
  reducer: {        
    user: userReducer,
    listings: listingsReducer,
    creator: creatorReducer,
    filter: filterReducer,
    messages: messagesReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }).concat(createSocketMiddleware())
})