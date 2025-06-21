import React from 'react';
import ReactDOM from 'react-dom/client';

import {Amplify} from 'aws-amplify';
import {awsExports} from "./aws-exports";
import CustomAuthLayout from './CustomAuthLayout';

Amplify.configure({
  ...awsExports,
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <CustomAuthLayout />
  </React.StrictMode>
);
