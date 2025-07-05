import { createSlice } from '@reduxjs/toolkit'

const profileReducer = createSlice({
    name: 'profileReducer',
    initialState: {
        userId:'',
        signInDetails: {},
        profile: {},
        experiences: [],
        userType: '',
    },
    reducers: {
        setField(state, action) {
            state[action.payload.name] = action.payload.value
        },
        
    },
})

export const { setField } = profileReducer.actions


export default profileReducer.reducer