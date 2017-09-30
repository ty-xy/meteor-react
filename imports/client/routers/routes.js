import React from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import createIndexPage from './createIndexPage';
import Chat from '../views/chat/chat';
import Project from '../views/project/project';
import Manage from '../views/manage/manage';
import Bakei from '../views/baike/baike';

const router = (
    <Router>
        <div>
            <Route exact path="/" render={createIndexPage(Chat)} />
            <Route path="/chat" render={createIndexPage(Chat)} />
            <Route path="/project" render={createIndexPage(Project)} />
            <Route path="/manage" render={createIndexPage(Manage)} />
            <Route path="/baike" render={createIndexPage(Bakei)} />
        </div>
    </Router>
);

export default router;
