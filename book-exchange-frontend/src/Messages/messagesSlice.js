import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const apiAdress = process.env.REACT_APP_API_ADRESS


export const fetchConversations = createAsyncThunk('conversations/fetch', async (args, {getState}) => {
    const state = getState()
    const response = await fetch(`${apiAdress}/messages/conversations`, {
        headers: {
            'x-access-token': state.user.auth.token
        }
    })
    if (response.ok) {
        const data = await response.json()
        return data
    } else {
        throw new Error()
    }
})

const initialState = {
    status: 'idle',
    data: [],
    error: null
}

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: { ...initialState },
    reducers: {  
        
    },
    extraReducers(builder) {
        builder.addCase(fetchConversations.pending, (state, action) => {
            state.status = 'loading'
        }).addCase(fetchConversations.fulfilled, (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
        }).addCase(fetchConversations.rejected, (state, action) => {
            state.status = 'failed'
            state.error = true
        })
    }    
})


export default messagesSlice.reducer