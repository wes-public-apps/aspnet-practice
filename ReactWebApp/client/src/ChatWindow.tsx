import React from 'react';

import Message, { IMessage } from './Message';

interface IChatWindowProps {
    chat: IMessage[];
}

interface IChatWindowState{
}

class ChatWindow extends React.Component<IChatWindowProps,IChatWindowState>{
   
    render(){
        return(
            <div>
                {
                    this.props.chat.map((m: IMessage) => <Message 
                        key={Date.now() * Math.random()}
                        User={m.User}
                        Message={m.Message}/>)
                }
            </div>
        )
    }
}

export default ChatWindow;