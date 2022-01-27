import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const apiAdress = process.env.REACT_APP_API_ADRESS

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
        .addCase('GET_TAGS', (state, action) => {
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
    }    
})

export default creatorSlice.reducer