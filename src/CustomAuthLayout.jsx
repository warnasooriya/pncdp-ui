import React, { useEffect, useState } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "./custom-auth.css";
import WelcomeImage from "./assets/welcome-image.png";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import { Provider } from "react-redux";
import { Store } from "./store";
import UserSyncronizer from "./UserSyncronizer";

export default function CustomAuthLayout() {
  const [userTypeOptions, setUserTypeOptions] = useState([
    { value: "", label: "Please select user type" },
  ]);

  useEffect(() => {
    // Simulate API call or config fetch
    const fetchUserTypes = async () => {
      // You can replace this with an API call if needed
      const options = [
        { label: "Candidate", value: "Candidate" },
        { label: "Recruiter", value: "Recruiter" },
      ];
      setUserTypeOptions([{ value: "", label: "Please select user type" }, ...options]);
    };

    fetchUserTypes();
  }, []);

  return (
    <Provider store={Store}>
      <Authenticator
        socialProviders={["google"]}
        initialState="signUp"
        components={{
          SignUp: {
            FormFields() {
              const [selectedUserType, setSelectedUserType] = useState("");

              const handleChange = (e) => {
                setSelectedUserType(e.target.value);
              };

              return (
                <>
                  <Authenticator.SignUp.FormFields />

                  {/* Dynamic User Type Dropdown */}
                  <div className="form-group-custom">
                    <label>User Type</label>
                    <select
                      name="custom:userType"
                      value={selectedUserType}
                      onChange={handleChange}
                      className="form-control-custom"
                      required
                    >
                      {userTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              );
            },
          },
        }}
      >
        {({ signOut, user }) => (
          <>
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
