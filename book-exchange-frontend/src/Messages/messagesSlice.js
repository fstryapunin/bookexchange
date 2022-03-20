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

export const fetchReadConversation = createAsyncThunk('conversations/read', async (id, {getState}) => {
    const state = getState()
    const response = await fetch(`${apiAdress}/messages/read`, {
        method: 'POST',
        headers: {
            'x-access-token': state.user.auth.token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id
        })
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
        .addCase(fetchReadConversation.fulfilled, (state, action) => {
            const conversationId = action.payload.id
            const conversationIndex = state.data.findIndex(conversation => parseInt(conversation.id) === parseInt(conversationId))
            state.data[conversationIndex].messages = action.payload.data
        })
        .addCase('GOT_WEBSOCKET_MESSAGE', (state, action) => {
            const messageData = action.payload.data[0]
            const conversationIndex = state.data.findIndex(convo => convo.id === messageData.conversation_id)
            state.data[conversationIndex].messages.push(messageData)        
        })
        .addCase('SENT_WEBSOCKET_MESSAGE', (state, action) => {
            const messageData = action.payload.data[0]
            const conversationIndex = state.data.findIndex(convo => convo.id === messageData.conversation_id)
            state.data[conversationIndex].messages.push(messageData) 
        })
    }    
})


export default messagesSlice.reducer