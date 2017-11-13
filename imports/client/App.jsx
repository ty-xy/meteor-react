import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
// import 'react-dragula/dist/dragula.css';
import 'antd/dist/antd.css';

import routes from './routers/routes';

@pureRender
class App extends Component {
    render() {
        return (
            <div className="app">
                {routes}
            </div>
        );
    }
}

export default App;
