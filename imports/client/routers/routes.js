import React from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import createIndexPage from './createIndexPage';
import Index from '../views/Index';
import Chat from '../views/chat/chat';
import Project from '../views/project/project';
import Manage from '../views/manage/manage';
import Bakei from '../views/baike/baike';
import Login from '../views/login/login';
import Register from '../views/login/register';
import AdminInfo from '../views/admin-info/AdminInfo';

const router = (
    <Router>
        <div>
            <Route path="/" component={Index} />
            <Route path="/chat" render={createIndexPage(Chat)} />
            <Route path="/project" render={createIndexPage(Project)} />
            <Route path="/manage" render={createIndexPage(Manage)} />
            <Route path="/baike" render={createIndexPage(Bakei)} />
            <Route path="/adminInfo" render={createIndexPage(AdminInfo)} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
        </div>
    </Router>
);

export default router;
