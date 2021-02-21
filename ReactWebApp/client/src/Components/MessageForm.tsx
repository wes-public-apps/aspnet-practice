// Wesley Murray
// 2/21/2021
// Define component that is a form to submit message

import React from "react";
import * as signalR from "@microsoft/signalr";

//define component prop type
interface IMessageFormProps {
    toServerConnection: signalR.HubConnection
}

//define component state
interface IMessageFormState {
    username: string,
    message: string,
    toServerConnection: signalR.HubConnection
}

class MessageForm extends React.Component<IMessageFormProps,IMessageFormState>{
    
    state: IMessageFormState;

    constructor(props: IMessageFormProps){
        super(props);
        this.state = {
            username: '',
            message: '',
            toServerConnection: props.toServerConnection
        }
    }

    onUsernameChange(event: React.FormEvent<HTMLInputElement>): void {
        this.setState({username: event.currentTarget.value})
    }
    onMessageChange(event: React.FormEvent<HTMLInputElement>): void {
        this.setState({message: event.currentTarget.value})
    }
    onSend(event: React.FormEvent<HTMLFormElement>){
        this.state.toServerConnection.send("newMessage", this.state.username, this.state.message)
          .then(() => this.state.message = "");
        event.preventDefault();
    }

    //create form
    render(){
        return (
            <form onSubmit={this.onSend}>
              <label>
                Username:
                <input type="text" name="username" value={this.state.username} onChange={this.onUsernameChange}/>
              </label>
              <label>
                Message:
                <input type="text" name="message" value={this.state.message} onChange={this.onMessageChange}/>
              </label>
              <input type="submit" value="Send" />
            </form>
          );
    }
}

export default MessageForm;