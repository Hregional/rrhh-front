import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { store } from "./redux/store";

import "./i18n";
import routes from "./routes";

import Loader from "./components/Loader";

import ThemeProvider from "./contexts/ThemeProvider";
import SidebarProvider from "./contexts/SidebarProvider";
import LayoutProvider from "./contexts/LayoutProvider";
import ChartJsDefaults from "./utils/ChartJsDefaults";

import AuthProvider from "./contexts/JWTProvider";
// import AuthProvider from "./contexts/FirebaseAuthProvider";
// import AuthProvider from "./contexts/Auth0Provider";
// import AuthProvider from "./contexts/CognitoProvider";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./utils/msalConfig";
const msalInstance = new PublicClientApplication(msalConfig);

const App = () => {
  const content = useRoutes(routes);

  return (
    <HelmetProvider>
      <Helmet titleTemplate="HRO" defaultTitle="HRO" />
      <Suspense fallback={<Loader />}>
        <Provider store={store}>
          <ThemeProvider>
            <SidebarProvider>
              <LayoutProvider>
                <ChartJsDefaults />
                <AuthProvider><MsalProvider instance={msalInstance}>
                      {content}
                    </MsalProvider></AuthProvider>
              </LayoutProvider>
            </SidebarProvider>
          </ThemeProvider>
        </Provider>
      </Suspense>
    </HelmetProvider>
  );
};

export default App;
