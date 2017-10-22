import React from 'react';
import {
    Route,
} from 'react-router-dom';
import ProjectWindow from './ProjectWindow/ProjectWindow';

export default () => (
    <div>
        <Route exact path="/project" component={ProjectWindow} />
        <Route path="/project/task" render={() => <h1>checking</h1>} />
        <Route path="/project/lender" render={() => <h1>checking</h1>} />
        <Route path="/project/file" render={() => <h1>notice</h1>} />
        <Route path="/project/chat" render={() => <h1>audit</h1>} />
        <Route path="/project/action" render={() => <h1>net</h1>} />
    </div>
);
