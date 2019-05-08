import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    messageID: 0,
    message: '',
    messages: [],
    nickname: '',
    hasNickname: false,
  };

  componentDidMount() {
    this.messagePoll();
  }

  messagePoll() {
    fetch('/messages', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    }).then((response) => response.json())
      .then((newMessage) => {
        this.setState({
          messages: [...this.state.messages, newMessage],
        }, () => { this.messagePoll() })
      })
      .catch((err) => {
        console.log(`Error: ${err}`)
        this.messagePoll();
      });
  }

  handleSubmit = async e => {
    const { nickname, message, messageID } = this.state;

    e.preventDefault();
    await fetch('/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageID, nickname, message, timestamp: + new Date() }),
    });
    this.setState({
      message: '',
      messageID: messageID + 1
    })
  };

  handleNicknameSubmit = e => {
    e.preventDefault();
    this.setState({ hasNickname: true });
  }

  getNicknameForm() {
    const { nickname } = this.state;
    return (
      <form onSubmit={this.handleNicknameSubmit}>
        <p>
          <strong>Enter a nickname:</strong>
        </p>
        <div className="InputContainer">
          <input
            type="text"
            value={nickname}
            placeholder="Nickname"
            onChange={e => this.setState({ nickname: e.target.value })}
          />
          <button disabled={!nickname} type="submit">Submit</button>
        </div>
      </form>
    )
  }

  getChat() {
    const { nickname, message } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <p>
          <strong>Hello, {nickname}!</strong>
        </p>
        <div className="InputContainer">
          <input
            type="text"
            placeholder="New message"
            value={message}
            onChange={e => this.setState({ message: e.target.value })}
          />
          <button disabled={!message} type="submit">Submit</button>
        </div>
      </form>
    );
  }

  render() {
    const { hasNickname, messages, nickname } = this.state;
    return (
      <div className="App">
        {!hasNickname ? this.getNicknameForm() : this.getChat()}
        {messages.length ? <div className="ChatBox">
          {messages.map(message => {
            const isUserMessage = message.nickname === nickname;
            return <div key={message.nickname + message.messageID} className="MessageContainer"
              style={isUserMessage ? { textAlign: 'right' } : { textAlign: 'left' }}>
              <span className="Message" style={isUserMessage ? { backgroundColor: '#3578e5', color: 'fff' } :
                { backgroundColor: '#f1f0f0', color: '#444950' }}>
                {isUserMessage ? null : <span className="Nickname">{message.nickname}:</span>} {message.message}
              </span>
            </div>
          })}
        </div> : null}
      </div>
    );
  }
}

export default App;