import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const catalogueSlice = createSlice({
  name: 'catalogue',
  initialState: {    
    search: '',
    display: 'all',
    sortBy: 'none',
    error: null
  },
    reducers: {
        setSearch() {}
  }, 
})

export default catalogueSlice.reducer