import React, { Component } from 'react';
import routes from './routers/routes';

class App extends Component {
    render() {
        return (
            <div className="page">
                {routes}
            </div>
        );
    }
}

export default App;
