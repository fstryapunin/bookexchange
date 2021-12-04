import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
const apiAdress = process.env.REACT_APP_API_ADRESS

export const fetchUserData = createAsyncThunk('user/fetchData', async (arg, { getState }) => {  
    const state = getState()
    const response = await fetch(`${apiAdress}/user/profile`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(
          {
              token: state.auth.token
          }
      )
    })
    const data = response.json()
    return data
})

export const fetchUserListings = createAsyncThunk('user/fetchListings', async (arg, {getState}) => {
    const state = getState()
    const response = await fetch(`${apiAdress}/user/listings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                token: state.auth.token
            }
        )
    })
    const data = response.json()
    return data
})

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: {},
        listings: [],        
        status: 'idle',
        listingsStatus: 'idle',
        listingsError: null,
        error: null
    },
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(fetchUserData.pending, (state, action) => {
            state.status = 'loading'            
        })
        .addCase(fetchUserData.fulfilled, (state, action) => {
            state.status = 'loaded'            
            state.data = action.payload
        })
        .addCase(fetchUserData.rejected, (state, action) => {            
            state.status = 'failed'
            state.error = action.error
        })
        .addCase(fetchUserListings.pending, (state, action) => {
            state.listingsStatus = 'loading'            
        })
        .addCase(fetchUserListings.fulfilled, (state, action) => {
            state.listingsStatus = 'loaded'            
            state.listings = action.payload
        })
        .addCase(fetchUserListings.rejected, (state, action) => {            
            state.listingsStatus = 'failed'
            state.error = action.error
        })
    }
})

export const selectUserListings = (listings, type) => {
    const filteredListings = listings.filter(listing => listing.type === type)    
    return filteredListings    
}

export default userSlice.reducer