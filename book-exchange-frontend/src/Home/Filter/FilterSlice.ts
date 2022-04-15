import { createSlice } from '@reduxjs/toolkit'

interface IState {
    tags: {
        loadedTags: Tag[],
        status: 'idle' | 'loading' | 'loaded',
        error: any
    }
}

const initialState: IState = {
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
        .addCase('LOADING_WEBSOCKET_TAGS', (state) => {
            state.tags.status = 'loading'
        })
        .addCase('GOT_WEBSOCKET_TAGS', (state, action: any) => {
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
        .addCase('CLEAR_WEBSOCKET_TAGS', (state) => {
            state.tags.status = 'idle'
            state.tags.loadedTags = []
        })
    }    
})


export const { resetFilter } = filterSlice.actions 
export default filterSlice.reducer