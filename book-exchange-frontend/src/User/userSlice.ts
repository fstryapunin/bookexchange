import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit'
import { RootState } from '../State/store'
const apiAdress = process.env.REACT_APP_API_ADRESS

export const fetchUserData = createAsyncThunk<User, void, {state: RootState}>('user/fetchData', async (arg, { getState }) => {  
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

export const fetchUserListings = createAsyncThunk<Listing[], void, { state: RootState}>('user/fetchListings', async (arg, {getState}) => {
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

export const authenticateUser = createAsyncThunk<{token: string}, void>('user/authenticate', async () => {
    const response = await fetch(`${apiAdress}/auth/getAccessToken`, { method: 'GET', credentials: 'include' })
    if (response.ok) {
        const data = response.json()
        return data
    } else {
        throw new Error()
    }
})
  
export const unauthenticateUser = createAsyncThunk<number, void>('user/unathenticate', async () => {  
    const response = await fetch(`${apiAdress}/auth/logout`, { method: 'GET', credentials: 'include' })  
    return response.status
})
  
export const authenticateUserWithGoogle = createAsyncThunk<{token: string}, string>('user/authenticateGoogle', async (credential) => {
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
    if (response.ok) {
        const data = response.json()
        return data
    } else {
        throw new Error()
    }
})

export const deleteUserListing = createAsyncThunk<string | number , string | number, {state: RootState}>('user/listing/delete', async (id, { getState }) => {   
    const state = getState()
    const response = await fetch(`${apiAdress}/user/listing/delete/${parseInt(id as string)}}`, {
        method: 'DELETE',
        headers: {
            'x-access-token': state.user.auth.token
        },
    })
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        throw new Error()
    }
})

export const updateListingStatus = createAsyncThunk<{ id: string | number, status: string }, { id: string | number, status: string }, { state: RootState }>
    ('user/listing/status', async (payload, { getState }) => {
    const state = getState()
    const response = await fetch(`${apiAdress}/user/listing/update/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': state.user.auth.token
        },
        body: JSON.stringify({
            status: payload.status,
            id: payload.id
        })
    })
    if (response.ok) { 
        const data = await response.json()
        return data
    } else {
        throw new Error()
    }
})

interface IState {
    auth: {
        status: 'idle' | 'authenticated' | 'unauthenticated' | 'loading',
        token: string,
        websocket: boolean,
        error: null | boolean| string | SerializedError | number
    },
    info: {
        status: 'idle' | 'loading' | 'loaded' | 'failed',
        data?: User,
        error: null | boolean | string | SerializedError | number
    },
    listings: {
        status: 'idle' | 'loading' | 'loaded' | 'failed',
        data: Listing[],
        error: null | boolean | string | SerializedError | number
    }
}

const initialState: IState = {
    auth: {
        status: 'idle',
        token: '',
        websocket: false,
        error: null
    },
    info: {
        status: 'idle',        
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
    reducers: {
        addUserListing: (state, action) => {
            state.listings.data = [action.payload, ...state.listings.data]
        },
        replaceUserListing: (state, action) => {
            const arrWithoutOld = state.listings.data.filter(listing => listing.id !== action.payload.id)
            const arrWithNew = [action.payload, ...arrWithoutOld]
            state.listings.data = arrWithNew
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUserData.pending, (state) => {
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
            .addCase(fetchUserListings.pending, (state) => {
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
            .addCase(authenticateUser.pending, (state) => {
                state.auth.status = 'loading'
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
                state.auth.status = 'authenticated'
                state.auth.token = action.payload.token
            })
            .addCase(authenticateUser.rejected, (state) => {
                state.auth.status = 'unauthenticated'
                state.auth.error = 401
            })
            .addCase(unauthenticateUser.fulfilled, () => {
                //reset set to initial on logout
                return initialState
            })
            .addCase(authenticateUserWithGoogle.fulfilled, (state, action) => {
                state.auth.status = 'authenticated'
                state.auth.token = action.payload.token
            })
            .addCase(deleteUserListing.fulfilled, (state, action: any) => {
                const id = parseInt(action.payload[0])
                state.listings.data = state.listings.data.filter(listing => listing.id !== id)
            })
            .addCase(updateListingStatus.fulfilled, (state, action: any) => {
                const id = action.payload.id[0]                
                state.listings.data.forEach(listing => {
                    if(listing.id === id) listing.status = action.payload.status
                })              
                
            })
            .addCase('GOT_WEBSOCKET_AUTHORIZATION', (state, action: any) => {
                if (action.payload.status === "success") {
                    state.auth.websocket = true
                }             
            })
    }    
})

export const selectUserListings = (listings: Listing[], type: string) => {
    const filteredListings = listings.filter(listing => listing.type === type)    
    return filteredListings    
}

export const selectListingById = (listings: Listing[], id: number) => {
    const listing = listings.find(listingObj => listingObj.id === id)
    return listing
}
export const { addUserListing, replaceUserListing } = userSlice.actions 
export default userSlice.reducer