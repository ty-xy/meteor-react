import React, { Component } from 'react';
import Header from './header/header.jsx';
import Chat from './chat/chat.jsx';

class App extends Component {
    render() {
        return (
            <div>
                <Header />
                <Chat />
            </div>
        );
    }
}

export default App;