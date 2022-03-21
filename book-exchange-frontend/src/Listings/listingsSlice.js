import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const apiAdress = process.env.REACT_APP_API_ADRESS

export const fetchListings = createAsyncThunk('listings/get', async (page = 0) => {
    const response = await fetch(`${apiAdress}/public/listings/new/${page}`)    
    if (response.ok) {
        const data = response.json()
        return data
    } else {
        throw new Error()
    }
})

export const fetchFilteredListings = createAsyncThunk('listings/filter', async (filters) => {    
    const response = await fetch(`${apiAdress}/public/listings/filter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
    })
    if (response.ok) {
        const data = response.json()
        return data
    } else {
        throw new Error()
    }
})

export const fetchListingById = createAsyncThunk('listings/get/id', async (id) => {
    const response = await fetch(`${apiAdress}/public/listing/${id}`, {

    })    
    if (response.ok) {
        const data = response.json()
        return data
    } else {
        throw new Error()
    }
})


export const listingsSlice = createSlice({
    name: 'listings',
    initialState: {        
        homepage: {
            status: 'idle',
            filtered: false,
            data: [],
            error: null
        }               
    },
    reducers: {
        addListing: (state, action) => {
            state.homepage.data = [action.payload, ...state.homepage.data]
        },
        replaceListing: (state, action) => {
            const arrWithoutOld = state.homepage.data.filter(listing => listing.id !== action.payload.id)
            const arrWithNew = [action.payload, ...arrWithoutOld]
            state.homepage.data = arrWithNew
        },
        removeListing: (state, action) => {
            state.homepage.data = state.homepage.data.filter(listing => listing.id !== action.payload.id)
        }
    },
    extraReducers(builder) {
        builder
        .addCase(fetchFilteredListings.pending, (state) => {
            state.homepage.status = 'loading'
            state.homepage.filtered = true
        })
        .addCase(fetchFilteredListings.fulfilled, (state, action) => {
            state.homepage.status = 'loaded'           
            state.homepage.data = action.payload    
        })
        .addCase(fetchFilteredListings.rejected, (state) => {            
            state.homepage.status = 'failed'            
        })
        .addCase(fetchListings.pending, (state) => {
            state.homepage.status = 'loading'
            state.homepage.filtered = false
            })
        .addCase(fetchListings.fulfilled, (state, action) => {
            state.homepage.status = 'loaded'            
            state.homepage.data = action.payload       
        })
        .addCase(fetchListings.rejected, (state) => {            
            state.homepage.status = 'failed'            
        })
        .addCase(fetchListingById.fulfilled, (state, action) => {                      
            state.homepage.data = [...state.homepage.data, action.payload]     
        })
    }
   
})

export const selectById = (state) => {
    


}

export const { addListing, replaceListing, removeListing } = listingsSlice.actions
  
export default listingsSlice.reducer