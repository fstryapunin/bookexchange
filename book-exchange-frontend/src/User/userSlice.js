import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
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
              token: state.user.auth.token
          }
      )
    })
    if (response.ok) {
        const data = response.json()
        return data
    } else {
        throw new Error()
    }
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
                token: state.user.auth.token
            }
        )
    })
    if (response.ok) {
        const data = response.json()    
        return data
    } else {
        throw new Error()
    }    
})

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

const initialState = {
    auth: {
        status: 'idle',
        token: '',
        error: null
    },
    info: {
        status: 'idle',
        data: {},
        error: null
    },
    listings: {
        status: 'idle',
        data: [],
        error: null
    }       
}

export const userSlice = createSlice({
    name: 'user',
    initialState: { ...initialState },
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase(fetchUserData.pending, (state, action) => {
            state.info.status = 'loading'            
        })
        .addCase(fetchUserData.fulfilled, (state, action) => {
            state.info.status = 'loaded'            
            state.info.data = action.payload
        })
        .addCase(fetchUserData.rejected, (state, action) => {            
            state.info.status = 'failed'
            state.info.error = action.error
        })
        .addCase(fetchUserListings.pending, (state, action) => {
            state.listings.status = 'loading'            
        })
        .addCase(fetchUserListings.fulfilled, (state, action) => {
            state.listings.status = 'loaded'            
            state.listings.data = action.payload
        })
        .addCase(fetchUserListings.rejected, (state, action) => {            
            state.listings.status = 'failed'
            state.listings.error = action.error
        })
        .addCase(authenticateUser.pending, (state, action) => {
            state.auth.status = 'loading'
        })
            .addCase(authenticateUser.fulfilled, (state, action) => {           
            state.auth.status = 'authenticated'        
            state.auth.token = action.payload.token       
        })
        .addCase(authenticateUser.rejected, (state, action) => {
            state.auth.status = 'unauthenticated'
            state.auth.error = 401
        })
        .addCase(unauthenticateUser.fulfilled, (state, action) => {   
            //reset set to initial on logout
            return initialState
        })
        .addCase(authenticateUserWithGoogle.fulfilled, (state, action) => {           
            state.auth.status = 'authenticated'
            state.auth.token = action.payload.token
        })        
    }    
})

export const selectUserListings = (listings, type) => {
    const filteredListings = listings.filter(listing => listing.type === type)    
    return filteredListings    
}

export const selectListingById = (listings, id) => {
    const listing = listings.find(listingObj => listingObj.id === id)
    return listing
}

export default userSlice.reducer