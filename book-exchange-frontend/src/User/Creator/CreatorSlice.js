import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loadedTags: [],    
    status: 'idle',
    error: null
}

export const creatorSlice = createSlice({
    name: 'creator',
    initialState: { ...initialState },
    reducers: {},
    extraReducers(builder) {
        builder
        .addCase('LOADING_WEBSOCKET_TAGS', (state, action) => {
            state.status = 'loading'
        })
        .addCase('GOT_WEBSOCKET_TAGS', (state, action) => {
            const data = action.payload
            if (data.status === 'success') {                
                    state.loadedTags = data.data
                    state.status = 'loaded'                
            }
            else {
                state.error = true
                state.loadedTags = []
            }
        })
        .addCase('CLEAR_WEBSOCKET_TAGS', (state, action) => {
            state.status = 'idle'
            state.loadedTags = []
        })
    }    
})

export default creatorSlice.reducer