import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const apiAdress = process.env.REACT_APP_API_ADRESS

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    data: [],
    status: 'idle',
    error: null
  },
  reducers: {
      add: (state, action) => {
        console.log(action)  
        state.data = [...state.data, action.payload]
    }    
  }
})

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await fetch(`${apiAdress}/categories`)
  return response.data
})


export const { add } = categoriesSlice.actions

export default categoriesSlice.reducer