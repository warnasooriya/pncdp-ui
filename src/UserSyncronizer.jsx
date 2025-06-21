import React, {  useEffect } from 'react';
import { setField } from './reducers/profileReducer';
import { useDispatch } from 'react-redux';
import axios from './api/axios';

export default function UserSyncronizer({ user }) {
  const dispatch = useDispatch();
 
  const sycUserWithBackend = async (user) => {

    if (!user || !user.userId) {
            console.error('Invalid user data:', user);
            return;
        }

           axios.put('/api/users',user)
      .then(res => {
        dispatch(setField({ name: 'userId', value: user.userId }));
      dispatch(setField({ name: 'signInDetails', value: user.signInDetails })); // Assuming user attributes contain profile info
      localStorage.setItem('userId', user.userId); // Store userId in localStorage

      console.log('User data synced successfully:', res.data);
      })
      .catch(err => console.error('Error fetching profile', err));
    
    
  };

  useEffect(() => {
    if (user) {
      // Dispatch actions to update the Redux store with user data
      sycUserWithBackend(user); // Sync user data with backend
     
     
    }
  }, [user, dispatch]);

  return null; // This component does not render anything
}