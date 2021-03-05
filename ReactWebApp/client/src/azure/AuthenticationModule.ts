// Wesley Murray
// 3/5/2021
// This file servers as a helper for handling authetication through Azure AD

import {AccountInfo, AuthenticationResult, Configuration,EndSessionRequest,LogLevel, PublicClientApplication, RedirectRequest} from "@azure/msal-browser";

//Define complex types used in Authentication Module
export type AccountInfoHandler = (account: AccountInfo | undefined) => void;

export class AuthenticationModule{

    //#region Static Variables
    static context: AuthenticationModule;
    static MSAL_CONFIG: Configuration = {
        auth: {
          clientId: process.env.REACT_APP_AZURE_AD_CLIENTID ? process.env.REACT_APP_AZURE_AD_CLIENTID : "",
        },
        cache: {
          cacheLocation: "sessionStorage",
          storeAuthStateInCookie: false,
        },
        system: {
          loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
              if (containsPii) {
                return;
              }
              switch (level) {
                case LogLevel.Error:
                  console.error(message);
                  return;
                case LogLevel.Info:
                  console.info(message);
                  return;
                case LogLevel.Verbose:
                  console.debug(message);
                  return;
                case LogLevel.Warning:
                  console.warn(message);
                  return;
              }
            },
          },
        },
    };
    //#endregion

    //#region Instance Variables
    private MSAL: PublicClientApplication;
    private account?: AccountInfo;
    isAuthenticationConfigured = false;
    //#endregion

    //#region constructors
    //make private for singleton pattern
    private constructor(){
        this.MSAL = new PublicClientApplication(AuthenticationModule.MSAL_CONFIG);

        if(AuthenticationModule.MSAL_CONFIG.auth.clientId!="") this.isAuthenticationConfigured=true;
    }
    //#endregion

    //#region Static Methods
    /**
     * Uses singleton pattern to ensure only one Authentication module is active.
     * @returns AuthenticationModule instance
     */
    static GetInstance() {
        return AuthenticationModule.context ? AuthenticationModule.context: new AuthenticationModule();
    }
    //#endregion

    //#region Public Instance Methods
    /**
     * Creates a popup to have user log in.
     * @param setUser handler to perform actions on retrieved account info
     */
    logIn(setUser: AccountInfoHandler){
        const loginRedirectRequest = {
            scopes: [],
            prompt: "select_account",
        };

        this.MSAL.loginPopup(loginRedirectRequest)
            .then((res: AuthenticationResult) =>{
                this.onLoginHandler(res,setUser);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    /**
     * Log user out of app.
     */
    logOut(account: AccountInfo){
        const logOutRequest: EndSessionRequest={
            account,
        };

        this.MSAL.logout(logOutRequest);
    }

    //#region Handlers
    /**
     * This method handles responding to the authentication redirect after the user signs in.
     * @param response contains result of authentication request
     * @param onAccountInfoRetrievedHandler handler to process retrieved account information
     */
    onLoginHandler = (response: AuthenticationResult,onAccountInfoRetrievedHandler: AccountInfoHandler) => {
        this.account = (response?.account !== null) ? response.account : this.getAccount();
        if(this.account) onAccountInfoRetrievedHandler(this.account);
    }
    //#endregion
    //#endregion

    //#region Private Instance Methods
    /**
     * @returns AccountInfo object of authenticated user or undefined if object cannot be found.
     */
    private getAccount(): AccountInfo | undefined {
        const currAccnts = this.MSAL.getAllAccounts();
        if(currAccnts===null) return undefined;
        if(currAccnts.length>1) return currAccnts[0]; // User should choose account. may need more logic here in future.
        if(currAccnts.length===1) return currAccnts[0];
        return undefined;
    }
    //#endregion

}