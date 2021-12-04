import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const apiAdress = process.env.REACT_APP_API_ADRESS

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await fetch(`${apiAdress}/categories`)
  const data = await response.json()
  return data
})

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    data: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers(builder) {
    builder
    .addCase(fetchCategories.pending, (state, action) => {
      state.status = 'loading'            
    })
    .addCase(fetchCategories.fulfilled, (state, action) => {
      state.status = 'loaded'    
      state.data = action.payload
    })
    .addCase(fetchCategories.rejected, (state, action) => {
      state.status = 'failed'            
    })
  }
})

export default categoriesSlice.reducer