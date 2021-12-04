import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const apiAdress = process.env.REACT_APP_API_ADRESS

export const authenticateUser = createAsyncThunk('user/authenticate', async () => {
  const response = await fetch(`${apiAdress}/auth/getAccessToken`, { method: 'GET', credentials: 'include' })
  const data = response.json()
  return data
})

export const unauthenticateUser = createAsyncThunk('user/unathenticate', async () => {
  const response = await fetch(`${apiAdress}/auth/logout`, { method: 'GET', credentials: 'include' })  
  return response.status
})

export const authenticateUserWithGoogle = createAsyncThunk('user/authenticateGoogle', async (credential) => {
  const response = await fetch(`${apiAdress}/auth/google/login`, { method: 'POST', credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {
            token: credential
        }
    )
  })
  const data = response.json()
  return data
})

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'idle',   
    token: '',
    error: null
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(authenticateUser.pending, (state, action) => {
      state.status = 'loading'
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.status = 'authenticated'        
        state.token = action.payload.token       
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.error = 401
      })
      .addCase(unauthenticateUser.fulfilled, (state, action) => {
        state.status = 'unauthenticated'
      })
      .addCase(authenticateUserWithGoogle.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.token = action.payload.token
      })
  }
})



export const getUser = state => state.user

export const { add } = authSlice.actions

export default authSlice.reducer