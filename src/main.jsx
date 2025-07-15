import React from 'react';
import ReactDOM from 'react-dom/client';

import {Amplify} from 'aws-amplify';
import {awsExports} from "./aws-exports";
import CustomAuthLayout from './CustomAuthLayout';

Amplify.configure({
  ...awsExports,
  oauth: {
    domain: 'ap-southeast-1uceaj7uja.auth.ap-southeast-1.amazoncognito.com',
    scope: ['email', 'profile', 'openid'],
    redirectSignIn: 'http://localhost:5173/',
    redirectSignOut: 'http://localhost:5173/',
    responseType: 'code', 
  },
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <CustomAuthLayout />
  </React.StrictMode>
);
