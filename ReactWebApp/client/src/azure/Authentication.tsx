// Wesley Murray
// 3/5/2021
// This file contains the UI functionality for authentication.

import React from "react";
import {AccountInfo} from "@azure/msal-browser";
import { AccountInfoHandler, AuthenticationModule } from "./AuthenticationModule";

interface IAuthenticationProps {
    onAuthenticatedHandler: any;
}

interface IAuthenticationState {
    authenticated: boolean;
    user: AccountInfo | undefined;
    authenticationModule: AuthenticationModule;
}

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

    logIn(){
        this.state.authenticationModule.logIn(this.onLoginHandler);
    }

    logOut(){
        if(this.state.user){
            this.props.onAuthenticatedHandler(undefined);
            this.state.authenticationModule.logOut(this.state.user);
        }
    }

    //#region Handlers
    //Using arrow style to perserve context
    onLoginHandler = (user: AccountInfo | undefined) => {
        this.setState({
            authenticated: (user?.name)?true:false, 
            user: user
        });
        this.props.onAuthenticatedHandler(user);
    }
    //#endregion

    render(){
        return this.state.authenticated ? <button onClick={this.logOut} >Log Out</button> : <button onClick={this.logIn} >Login</button>;
    }
}