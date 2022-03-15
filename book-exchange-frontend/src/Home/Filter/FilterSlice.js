import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    tags: {
        loadedTags: [],                
        status: 'idle',
        error: null
    }
}

export const filterSlice = createSlice({
    name: 'filter',
    initialState: { ...initialState },
    reducers: {       
        resetFilter: (state) => {
            Object.assign(state, initialState)
        }
    },
    extraReducers(builder) {
        builder
        .addCase('LOADING_WEBSOCKET_TAGS', (state, action) => {
            state.tags.status = 'loading'
        })
        .addCase('GOT_WEBSOCKET_TAGS', (state, action) => {
            const data = action.payload
            if (data.status === 'success') {                
                    state.tags.loadedTags = data.data
                    state.tags.status = 'loaded'                
            }
            else {
                state.tags.error = true
                state.tags.loadedTags = []
            }
        })
        .addCase('CLEAR_WEBSOCKET_TAGS', (state, action) => {
            state.tags.status = 'idle'
            state.tags.loadedTags = []
        })
    }    
})

export const { resetfilter } = filterSlice.actions 
export default filterSlice.reducer