// Wesley Murray
// 2/21/2021
// Define a component for listing sent messages.

import React from "react";
import * as signalR from "@microsoft/signalr";

interface IMessageProps {
    username: string,
    message: string
}

//single message to display
export const Message=({username,message}: IMessageProps)=>{
    <p>{username} says {message}</p>
}

interface IMessageBoardProps{
    toServerConnection: signalR.HubConnection
}

interface IMessageBoardState{
    messages: IMessageProps[]
}

class MessageBoard extends React.Component<IMessageBoardProps,IMessageBoardState>{
    state: IMessageBoardState;

    constructor(props: IMessageBoardProps){
        super(props);
        this.state ={
            messages: [{username: "sample user",message:"sample message"}]
        }
        props.toServerConnection.on("messageReceived", (username: string, message: string) => {
            this.state.messages.push({username: username,message: message});
        });
    }

    render(){
        return (
            <div>
                {this.state.messages.map(Message)}
            </div>
        );
    }
}

export default MessageBoard;