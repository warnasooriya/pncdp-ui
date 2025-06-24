import { Authenticator, Button } from "@aws-amplify/ui-react";
import './custom-auth.css'; // Custom styling
import WelcomeImage from './assets/welcome-image.png';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { Provider } from "react-redux";
import { Store } from "./store";
import UserSyncronizer from "./UserSyncronizer";

export default function CustomAuthLayout() {
  return (
    <Provider store={Store}>
      <Authenticator socialProviders={['google']} // <- This enables the Google button
        initialState="signIn"
        
      >
 
        {({ signOut, user }) => (
          <>
          {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}

          <UserSyncronizer user={user} />
          <BrowserRouter>

            <ThemeProvider theme={theme}>
              <CssBaseline />
              <App />
            </ThemeProvider>
          </BrowserRouter>
          </>  
        )}
      </Authenticator>
    </Provider>
  );
}
