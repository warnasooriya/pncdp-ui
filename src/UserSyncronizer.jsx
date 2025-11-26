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
    // console.log('Syncing user with backend:', user);
    let userType = user['custom:userType'];
    const userTypes = user['custom:userTypes'];
    if (userTypes) {
      userType = userTypes;
    }
    console.log(userType);
     localStorage.setItem('userType',userType); 
    dispatch(setField({ name: 'userType', value: userType}));
    user['userType']=userType;
    
    if (!user || !user.sub || !user.email) {
            console.error('User data is incomplete:', user);
            return;
        }
           axios.put('/api/candidate/users',user)
      .then(res => {
        console.log('User data synced with backend:', res.data);

      dispatch(setField({ name: 'userId', value: user.sub }));
      dispatch(setField({ name: 'email', value: user.email }));
      localStorage.setItem('userId', user.sub); 

      console.log('User data synced successfully:', res.data);
      })
      .catch(err => console.error('Error fetching profile', err));
    
    
  };

  const fetchUserDetails = async () => {
      try {
         const user =  await fetchAuthSession();
        const idToken = user.tokens.idToken.toString();
        // console.log('idToken', idToken);
        const decodedToken = jwtDecode(idToken);
        // console.log('Decoded Token:', decodedToken);
        // console.log(localStorage.getItem('userId'));
        await sycUserWithBackend(decodedToken); // Sync user data with backend
        const currentUserId = localStorage.getItem('userId')?? decodedToken.sub;
          axios.get('/api/candidate/profile?id='+currentUserId)
              .then(res => {
                dispatch(setField({ name: 'profile', value: res.data }));
              })
              .catch(err => console.error('Error fetching profile', err));
              
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
