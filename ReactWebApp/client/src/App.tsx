
import { AccountInfo } from '@azure/msal-common';
import React from 'react';
import { AuthenticationButton } from './azure/Authentication';
import Chat from './Chat';

interface IAppProps{

}

interface IAppState{
  currentUser: AccountInfo | undefined;
}

class App extends React.Component<IAppProps,IAppState> {
  state: IAppState;

  constructor(props: IAppProps){
    super(props);

    this.state = {
      currentUser: undefined
    };
  }

  //#region Handlers
  onAuthenticatedHandler = async (user: AccountInfo) => {
    this.setState({currentUser: user});
  }
  //#endregion

  render(){
    return (
      <div style={{ margin: '0 30%' }}>
        <AuthenticationButton onAuthenticatedHandler={this.onAuthenticatedHandler} />
        <h1>Welcome to the Chat App!</h1>
        {this.state.currentUser?<Chat />:<p>Login to chat.</p>}
      </div>
    );
  }
}

export default App;