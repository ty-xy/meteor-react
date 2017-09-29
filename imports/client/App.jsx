import React, { Component } from 'react';
import Header from './views/header/header';
import Chat from './views/chat/chat';

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
