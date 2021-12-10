import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const apiAdress = process.env.REACT_APP_API_ADRESS

export const fetchListings = createAsyncThunk('listings/get', async () => {
    const response = await fetch(`${apiAdress}/public/listings/new/0`)
    const data = response.json()
    return data
})
  

export const listingsSlice = createSlice({
    name: 'listings',
    initialState: {
        status: 'idle',
        data: [],
        error: null
    },
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(fetchListings.pending, (state, action) => {
            state.status = 'loading'
            })
        .addCase(fetchListings.fulfilled, (state, action) => {
            state.status = 'loaded'            
            state.data = action.payload       
            })
        .addCase(fetchListings.rejected, (state, action) => {
            state.status = 'failed'            
        })
    }
   
})
  
export default listingsSlice.reducer