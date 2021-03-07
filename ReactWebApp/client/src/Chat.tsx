
import React from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import { IMessage } from './Message';
import { AccountInfo } from '@azure/msal-common';

interface IChatProps {
    user: AccountInfo | undefined
}

interface IChatState {
    connection: HubConnection | null;
    chat: IMessage[];
}

class Chat extends React.Component<IChatProps,IChatState>{
    state: IChatState;

    constructor(props: IChatProps){
        super(props);

        let newConnection: HubConnection | null = null;
        try {
            newConnection = new HubConnectionBuilder()
                .withUrl('/hubs/chat')
                .withAutomaticReconnect()
                .build();
            console.log("built without error")
        }catch(e){
            console.log(e);
        }
        this.state = {
            connection: newConnection,
            chat: []
        }
    
        if(this.state.connection===null) return;

        this.state.connection.start()
        .then(result => {
            this.state.connection!.on('RecieveMessage',(username: string, message: string) => {
                this.setState(state => {            
                    return {
                      connection: state.connection,
                      chat: [...state.chat, {User:username,Message:message}]
                    };
                });
                console.log(this.state);
            });

        })
        .catch(e => console.log("Failed to Connect."))

        this.sendMessage = this.sendMessage.bind(this);
        
    }

    async sendMessage(message: string){
        try {
            if (this.state.connection!.state===HubConnectionState.Connected){
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
                <ChatWindow chat={this.state.chat}/>
            </div>
        );
    }
}

export default Chat;