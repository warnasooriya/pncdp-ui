import { configureStore } from '@reduxjs/toolkit'
import profileReducer from './reducers/profileReducer';
import jobsReducer from './reducers/jobsReducer';
import networkReducer from './reducers/networkReducer';


export const Store = configureStore({
  reducer: {
     jobsReducer,
    profileReducer: profileReducer,
    network: networkReducer,
  },
})
