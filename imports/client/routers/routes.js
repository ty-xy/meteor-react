import React from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import createIndexPage from './createIndexPage';
import Index from '../views/Index';
import Chat from '../views/chat/Chat';
import Project from '../views/project/Project';
import Manage from '../views/manage/Manage';
import Bakei from '../views/baike/Baike';
import Login from '../views/login/Login';
import Register from '../views/login/Register';
import AdminInfo from '../views/admin-info/AdminInfo';
import ForgetPassword from '../views/login/forgetPassward/ForgetPassword';

const router = (
    <Router>
        <div>
            <Route path="/" component={Index} />
            <Route path="/chat" component={createIndexPage(Chat)} />
            <Route path="/project" component={createIndexPage(Project)} />
            <Route path="/manage" component={createIndexPage(Manage)} />
            <Route path="/baike" component={createIndexPage(Bakei)} />
            <Route path="/adminInfo" component={createIndexPage(AdminInfo)} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/forgetPassword" component={ForgetPassword} />
        </div>
    </Router>
);

export default router;
