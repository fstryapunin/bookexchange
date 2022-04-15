import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../User/userSlice'
import listingsReducer from '../Listings/listingsSlice'
import creatorReducer from '../User/Creator/CreatorSlice'
import filterReducer from '../Home/Filter/FilterSlice'
import messagesReducer from '../Messages/messagesSlice'
import { createSocketMiddleware } from './websocket'


const store = configureStore({
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

export default store 

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch