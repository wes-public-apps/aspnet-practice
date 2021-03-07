import React from 'react';

interface IChatInputProps{
    sendMessage(message: string): void;
}

interface IChatInputState{
    message: string;
}

class ChatInput extends React.Component<IChatInputProps,IChatInputState>{
    state: IChatInputState;

    constructor(props: IChatInputProps){
        super(props);
        this.state = {
            message: ""
        }
        this.onMessageUpdate = this.onMessageUpdate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>){
        const isMessageProvided = this.state.message && this.state.message !== '';

        if (isMessageProvided) {
            this.props.sendMessage(this.state.message);
        } 
        else {
            alert('Please insert an user and a message.');
        }

        this.setState({message: ""});

        e.preventDefault();
    }

    onMessageUpdate(e: React.FormEvent<HTMLInputElement>){
        this.setState({message: e.currentTarget.value});
    }

    render(){
        return (
            <form 
                onSubmit={this.onSubmit}>
                <label htmlFor="message">Message:</label>
                <br />
                <input 
                    type="text"
                    id="message"
                    name="message" 
                    value={this.state.message}
                    onChange={this.onMessageUpdate} />
                <br/><br/>
                <button>Submit</button>
            </form>
        )
    }

}

export default ChatInput;