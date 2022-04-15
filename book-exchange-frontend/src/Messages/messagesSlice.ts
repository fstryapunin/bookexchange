import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../State/store'
const apiAdress = process.env.REACT_APP_API_ADRESS


export const fetchConversations = createAsyncThunk<Conversation[], void, { state: RootState }>('conversations/fetch', async (args, { getState }) => {
    const state: RootState = getState()
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

interface IReadConvo{
    id: number,
    data: Message[]
}

export const fetchReadConversation = createAsyncThunk<IReadConvo, string | number,  { state: RootState }>('conversations/read', async (id, {getState}) => {
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

interface IState {
    status: 'idle' | 'loading' | 'loaded' | 'failed',
    data: Conversation[],
    error: null | string | boolean
}

const initialState : IState = {
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
        builder.addCase(fetchConversations.pending, (state) => {
            state.status = 'loading'
        }).addCase(fetchConversations.fulfilled, (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
        }).addCase(fetchConversations.rejected, (state) => {
            state.status = 'failed'
            state.error = true
        })
        .addCase(fetchReadConversation.fulfilled, (state, action) => {
            const conversationId = action.payload.id
            const conversationIndex = state.data.findIndex(conversation => conversation.id === conversationId)
            state.data[conversationIndex].messages = action.payload.data
        })
        .addCase('GOT_WEBSOCKET_MESSAGE', (state, action: any) => {          
            if (action.payload.status === 'success') {

                if (action.new) { 
                    const conversation = action.payload.data[0]
                    state.data = [conversation, ...state.data]
                }else {
                    const messageData = action.payload.data[0]
                    const conversationIndex = state.data.findIndex(convo => convo.id === messageData.conversation_id)
                    state.data[conversationIndex].messages.push(messageData)
                }
            }    
        })
        .addCase('SENT_WEBSOCKET_MESSAGE', (state, action: any) => {             
            if (action.payload.status === 'success') {
                if (action.new) { 
                    const conversation = action.payload.data[0]
                    state.data = [conversation, ...state.data]
                } else {
                    const messageData = action.payload.data[0]
                    const conversationIndex = state.data.findIndex(convo => convo.id === messageData.conversation_id)
                    state.data[conversationIndex].messages.push(messageData)
                }
            } 
        })
    }    
})

export const selectNewMessageCount = (state: RootState) => {
    const id = state.user.info.data?.id  
    
    if (state.messages.status !== 'loaded') {
        return null
    } else {
        let count = 0

        state.messages.data.forEach(conversation => {
            conversation.messages.forEach(message => {
                if(message.seen === false && message.creator_id !== id) count ++
            })
        })

        return count
    }    
}

export default messagesSlice.reducer