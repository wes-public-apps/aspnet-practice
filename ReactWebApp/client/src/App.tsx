
import { AccountInfo } from '@azure/msal-common';
import React from 'react';
import { AuthenticationButton } from './azure/Authentication';
import Chat from './Chat';

//#region Type Definitions
interface IAppProps{

}

interface IAppState{
  currentUser: AccountInfo | undefined;
}
//#endregion

class App extends React.Component<IAppProps,IAppState> {
  state: IAppState;

  constructor(props: IAppProps){
    super(props);

    this.state = {
      currentUser: undefined
    };

    //Bind handler context to handlers
    this.onAuthenticatedHandler = this.onAuthenticatedHandler.bind(this);
  }

  //#region Handlers
  //Update app state with results of authentication.
  async onAuthenticatedHandler(user: AccountInfo) {
    this.setState({currentUser: user});
  }
  //#endregion

  render(){
    return (
      <div style={{ margin: '0 30%' }}>
        <AuthenticationButton onAuthenticatedHandler={this.onAuthenticatedHandler} />
        <h1>Welcome to the Chat App!</h1>
        {this.state.currentUser?<Chat user={this.state.currentUser} />:<p>Login to chat.</p>}
      </div>
    );
  }
}

export default App;