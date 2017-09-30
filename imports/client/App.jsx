import React, { Component } from 'react';
import Login from './views/login/login';
import Header from './views/header/header';
import Chat from './views/chat/chat';

class App extends Component {
    render() {
        return (
            <div className="page">
                <Login />
                <Header style={{ display: 'none' }} />
                <Chat style={{ display: 'none' }} />
            </div>
        );
    }
}

export default App;
