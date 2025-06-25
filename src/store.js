import { configureStore } from '@reduxjs/toolkit'
import profileReducer from './reducers/profileReducer';
import jobsReducer from './reducers/jobsReducer';


export const Store = configureStore({
  reducer: {
     jobsReducer,
    profileReducer: profileReducer,
  },
})
