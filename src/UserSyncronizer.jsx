import React, {  useEffect,useRef  } from 'react';
import { setField } from './reducers/profileReducer';
import { useDispatch } from 'react-redux';
import axios from './api/axios';
import { fetchAuthSession , } from "@aws-amplify/auth";
import {jwtDecode} from 'jwt-decode';

export default function UserSyncronizer() {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  const sycUserWithBackend = async (user) => {
    console.log('Syncing user with backend:', user);
    if (!user || !user.sub || !user.email) {
            console.error('User data is incomplete:', user);
            return;
        }
           axios.put('/api/users',user)
      .then(res => {
        dispatch(setField({ name: 'userId', value: user.sub }));
      dispatch(setField({ name: 'email', value: user.email })); // Assuming user attributes contain profile info
      localStorage.setItem('userId', user.sub); // Store userId in localStorage

      console.log('User data synced successfully:', res.data);
      })
      .catch(err => console.error('Error fetching profile', err));
    
    
  };

  const fetchUserDetails = async () => {
      try {
         const user =  await fetchAuthSession();
        const idToken = user.tokens.idToken.toString();
        console.log('idToken', idToken);
        const decodedToken = jwtDecode(idToken);
        console.log('Decoded Token:', decodedToken);
        await sycUserWithBackend(decodedToken); // Sync user data with backend
      } catch (err) {
        console.error('Error fetching user attributes', err);
      }
    };

  useEffect(() => {
    if (!hasFetched.current) {
      // Fetch user details from AWS Amplify Auth
       hasFetched.current = true; // ✅ run only once
      fetchUserDetails();
 
     }
  }, []);

}