import { createSlice } from '@reduxjs/toolkit'

interface IState {
    tags: {
        loadedTags: Tag[],
        selectedTags: Tag[],
        newTags: { text: string }[],
        status: 'idle' | 'loading' | 'success' | 'loaded',
        error: any
    },
    images: {
        title: string | null,
        uploads: any[]   
    }
}

const initialState: IState = {
    tags: {
        loadedTags: [],
        selectedTags: [],
        newTags: [],
        status: 'idle',
        error: null
    },
    images: {
        uploads: [],
        title: null
    }
}

export const creatorSlice = createSlice({
    name: 'creator',
    initialState: { ...initialState },
    reducers: {
        setTitleImage: (state, action) => {
            state.images.title = action.payload
        },
        uploadImages: (state, action) => {            
            if (!state.images.title) {
                state.images.title = action.payload[0].name
            }            
            state.images.uploads = [...state.images.uploads, ...action.payload]
        },
        removeImage: (state, action) => {
            state.images.uploads = state.images.uploads.filter(image => action.payload.name !== image.name)
            if (action.payload.name === state.images.title) {
                if (state.images.uploads.length > 0) {
                    state.images.title = state.images.uploads[0].name
                } else {
                    state.images.title = null
                }
            }                        
        },
        resetCreator: (state) => {
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

export const { setTitleImage, uploadImages, removeImage, resetCreator } = creatorSlice.actions 
export default creatorSlice.reducer