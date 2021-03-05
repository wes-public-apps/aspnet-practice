// Wesley Murray
// 3/5/2021
// This file contains the UI functionality for authentication.

import React from "react";
import {AccountInfo} from "@azure/msal-browser";
import { AccountInfoHandler, AuthenticationModule } from "./AuthenticationModule";

//#region Type Definitions

//Component Properties
interface IAuthenticationProps {
    onAuthenticatedHandler: any;
}

//Component State
interface IAuthenticationState {
    authenticated: boolean;
    user: AccountInfo | undefined;
    authenticationModule: AuthenticationModule;
}
//#endregion

export class AuthenticationButton extends React.Component<IAuthenticationProps,IAuthenticationState>{

    state: IAuthenticationState;

    constructor(props: IAuthenticationProps){
        super(props);

        this.state = {
            authenticated: false,
            user: undefined,
            authenticationModule: AuthenticationModule.GetInstance(),
        }

        this.logIn = this.logIn.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    //#region Public Instance Methods

    /** Triggers log in process. */
    logIn(){
        this.state.authenticationModule.logIn(this.onLoginHandler);
    }

    /** Triggers log out process. */
    logOut(){
        if(this.state.user){
            this.props.onAuthenticatedHandler(undefined);
            this.state.authenticationModule.logOut(this.state.user);
        }
    }
    //#endregion

    //#region Handlers
    //Updates component state based on Authentication results
    onLoginHandler = (user: AccountInfo | undefined) => {
        this.setState({
            authenticated: (user?.name)?true:false, 
            user: user
        });
        this.props.onAuthenticatedHandler(user);
    }
    //#endregion

    //Use JSX to create login/logout buttons when applicable.
    render(){
        return this.state.authenticated ? <button onClick={this.logOut} >Log Out</button> : <button onClick={this.logIn} >Log in</button>;
    }
}