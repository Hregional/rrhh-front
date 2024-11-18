import { ScopeSet } from './../../node_modules/@azure/msal-common/src/request/ScopeSet';
import { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
    auth: {
        clientId: "2cce14f2-deec-4358-9ce8-e56beecdea1b", // Reemplaza con tu ID de aplicación cliente de Azure
        // clientId: "8964591d-6455-4d7e-a362-8a84124131a8", // Reemplaza con tu ID de aplicación cliente de Azure
        authority: "https://login.microsoftonline.com/5f53b4ce-63d4-4ee8-88d2-22f0b2d4b27a", // Reemplaza con tu ID de tenant
        redirectUri: window.location.origin,
      },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    }
};
