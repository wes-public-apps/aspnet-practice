// Wesley Murray
// 3/5/2021
// This component handles the chat app functionality.

import React from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import { IMessage } from './Message';
import { AccountInfo } from '@azure/msal-common';

//#region Type Definitions
interface IChatProps {
    user: AccountInfo | undefined
}

interface IChatState {
    connection: HubConnection | null;
    messages: IMessage[];
}
//#endregion

class Chat extends React.Component<IChatProps,IChatState>{
    state: IChatState;

    constructor(props: IChatProps){
        super(props);

        //Connect to ASP.NET Hub for real-time communication
        let newConnection: HubConnection | null = null;
        try {
            console.log("Building Connection");
            newConnection = new HubConnectionBuilder()
                .withUrl('/hubs/chat')
                .withAutomaticReconnect()
                .build();
            console.log("built without error")
        }catch(e){
            console.log(e);
        }

        //Initialize state
        this.state = {
            connection: newConnection,
            messages: [{User: "user",Message: "message"}]
        }
    
        if(this.state.connection===null) return;

        this.state.connection.start()
        .then(result => {
            this.state.connection!.on('RecieveMessage',(user: string, message: string) => {
                this.setState(state => {         
                    return {
                      connection: state.connection,
                      messages: [...state.messages, {User:user,Message:message}]
                    };
                });
                console.log(this.state);
            });

        })
        .catch(e => console.log("Failed to Connect."))

        //Bind handler context to handlers
        this.sendMessage = this.sendMessage.bind(this);
        
    }

    //#region Public Methods
    /**
     * Calls ASP.NET Core Hub method "SendMessage".
     * @param message message to send to recipients
     */
    async sendMessage(message: string){
        try {
            if (this.state.connection!.state===HubConnectionState.Connected){
                console.log("Message Sent");
                await this.state.connection!.send('SendMessage', this.props.user?.name ? this.props.user.name : "NO_NAME", message);
            }else{
                console.log("Disconnected");
            }
        }
        catch(e) {
            console.log(e);
        }
    }

    render(){
        if (this.state.connection===null) return <p>No Connection!</p>;
        return (
            <div>
                <ChatInput sendMessage={this.sendMessage} />
                <hr />
                <ChatWindow messages={this.state.messages}/>
            </div>
        );
    }
    //#endregion
}

export default Chat;