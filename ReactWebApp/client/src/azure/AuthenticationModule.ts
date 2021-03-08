// Wesley Murray
// 3/5/2021
// This file servers as a helper for handling authetication through Azure AD

import {AccountInfo, AuthenticationResult, Configuration,EndSessionRequest,LogLevel, PublicClientApplication} from "@azure/msal-browser";

//#region Type Declarations
//Define complex types used in Authentication Module
export type AccountInfoHandler = (account: AccountInfo | undefined) => void;
//#endregion

export class AuthenticationModule{

    //#region Static Variables
    private static context: AuthenticationModule; //singleton pattern
    private static MSAL_CONFIG: Configuration = {
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
    isAuthenticationConfigured = false;
    //#endregion

    //#region constructors
    //make private for singleton pattern
    private constructor(){
        this.MSAL = new PublicClientApplication(AuthenticationModule.MSAL_CONFIG);
        if(AuthenticationModule.MSAL_CONFIG.auth.clientId!=="") this.isAuthenticationConfigured=true;
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
     * This method does not support redirect login because it is unnecessary for modern browsers. 
     * @param parentOnLoginHandler handler to perform actions on retrieved account info
     */
    logIn(parentOnLoginHandler: AccountInfoHandler){
        const loginRedirectRequest = {
            scopes: [],
            prompt: "select_account",
        };

        this.MSAL.loginPopup(loginRedirectRequest)
            .then((res: AuthenticationResult) =>{
              const account = (res?.account !== null) ? res.account : this.getAccount();
              if(account) parentOnLoginHandler(account);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    /**
     * Log current user out.
     * @param user current user's account info
     */
    logOut(user: AccountInfo){
        const logOutRequest: EndSessionRequest={
            account: user,
        };

        this.MSAL.logout(logOutRequest);
    }
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