import React from 'react';

interface IChatInputProps{
    sendMessage(user: string,message: string): void;
}

interface IChatInputState{
    user: string;
    message: string;
}

class ChatInput extends React.Component<IChatInputProps,IChatInputState>{
    state: IChatInputState;

    constructor(props: IChatInputProps){
        super(props);
        this.state = {
            user: "",
            message: ""
        }
        this.onUserUpdate = this.onUserUpdate.bind(this);
        this.onMessageUpdate = this.onMessageUpdate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>){
        const isUserProvided = this.state.user && this.state.user !== '';
        const isMessageProvided = this.state.message && this.state.message !== '';

        if (isUserProvided && isMessageProvided) {
            this.props.sendMessage(this.state.user, this.state.message);
        } 
        else {
            alert('Please insert an user and a message.');
        }

        this.setState({user: "",message: ""});

        e.preventDefault();
    }

    onUserUpdate(e: React.FormEvent<HTMLInputElement>){
        this.setState({user: e.currentTarget.value});
    }
    onMessageUpdate(e: React.FormEvent<HTMLInputElement>){
        this.setState({message: e.currentTarget.value});
    }

    render(){
        return (
            <form 
                onSubmit={this.onSubmit}>
                <label htmlFor="user">User:</label>
                <br />
                <input 
                    id="user" 
                    name="user" 
                    value={this.state.user}
                    onChange={this.onUserUpdate} />
                <br/>
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