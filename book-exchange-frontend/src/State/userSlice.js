import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const apiAdress = process.env.REACT_APP_API_ADRESS

export const fetchUserData = createAsyncThunk('user/fetchData', async (arg, { getState }) => {  
    const state = getState()
    const response = await fetch(`${apiAdress}/user/getUserProfile`, {
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
        status: 'idle',
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
    }
})

export const { add } = userSlice.actions

export default userSlice.reducer