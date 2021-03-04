import React from 'react';
import {
  Button,
  Jumbotron
} from 'reactstrap';
import Chat from './Chat';

interface HomeProps {
  isAuthenticated: boolean;
  authButtonMethod: any;
  user: any;
}

interface HomeState {
  isOpen: boolean;
}

function HomeContent(props: HomeProps) {
  // If authenticated, greet the user
  if (props.isAuthenticated) {
    return (
      <div>
        <h4>Welcome {props.user.displayName}!</h4>
        <p>Use the navigation bar at the top of the page to get started.</p>
      </div>
    );
  }

  // Not authenticated, present a sign in button
  return <Button color="primary" onClick={props.authButtonMethod}>Click here to sign in</Button>;
}

export default class Home extends React.Component<HomeProps, HomeState> {
  render() {
    return (
      <Jumbotron>
        <h1>Chat App</h1>
        {this.props.isAuthenticated?<Chat /> : <p>Sign in to use chat.</p>}
        <HomeContent
          isAuthenticated={this.props.isAuthenticated}
          user={this.props.user}
          authButtonMethod={this.props.authButtonMethod} />
      </Jumbotron>
    );
  }
}