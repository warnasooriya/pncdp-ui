import { configureStore } from '@reduxjs/toolkit'
import profileReducer from './reducers/profileReducer';


export const Store = configureStore({
  reducer: {
    profileReducer: profileReducer,
  },
})
