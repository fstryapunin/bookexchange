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
        homepage: {
            status: 'idle',
            data: [],
            error: null
        }               
    },
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(fetchListings.pending, (state, action) => {
            state.homepage.status = 'loading'
            })
        .addCase(fetchListings.fulfilled, (state, action) => {
            state.homepage.status = 'loaded'            
            state.homepage.data = action.payload       
        })
        .addCase(fetchListings.rejected, (state, action) => {            
            state.homepage.status = 'failed'            
        })        
    }
   
})
  
export default listingsSlice.reducer