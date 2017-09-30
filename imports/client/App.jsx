import React, { Component } from 'react';
import Login from './views/login/login';
import Header from './views/header/header';
import Chat from './views/chat/chat';
import Register from './views/login/register';

class App extends Component {
    render() {
        return (
            <div className="page">
                <Register style={{ display: 'none' }} />
                <Login style={{ display: 'none' }} />
                <Header style={{ display: 'block' }} />
                <Chat style={{ display: 'block' }} />
            </div>
        );
    }
}

export default App;
