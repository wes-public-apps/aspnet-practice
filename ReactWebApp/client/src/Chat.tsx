
import React from 'react';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import { IMessage } from './Message';

interface IChatProps {
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
            console.log("Building Connection");
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
            chat: [{User: "user",Message: "message"}]
        }
    
        if(this.state.connection===null) return;

        this.state.connection.start()
        .then(result => {
            console.log('Connected!');

            this.state.connection!.on('RecieveMessage',(user: string, message: string) => {
                console.log("Recieved Message");
                this.setState(state => {
                    console.log(user+" "+message);              
                    return {
                      connection: state.connection,
                      chat: [...state.chat, {User:user,Message:message}]
                    };
                });
                console.log(this.state);
            });

        })
        .catch(e => console.log("Failed to Connect."))

        this.sendMessage = this.sendMessage.bind(this);
        
    }

    async sendMessage(user: string, message: string){
        try {
            console.log("Sending message! "+user+" "+message);
            if (this.state.connection!.state===HubConnectionState.Connected){
                console.log("Message Sent");
                await this.state.connection!.send('SendMessage', user, message);
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