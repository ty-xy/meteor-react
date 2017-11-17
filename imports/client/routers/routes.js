import React from 'react';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';

import createIndexPage from './createIndexPage';
// import createIndexPage from './createIndexPage';
import Index from '../views/Index';
import Chat from '../views/chat/Chat';
import Project from '../views/project/Project';
import Manage from '../views/manage/Manage';
import Bakei from '../views/baike/Baike';
import Login from '../views/login/Login';
import Register from '../views/login/Register';
import AdminInfo from '../views/admin-info/AdminInfo';
import ForgetPassword from '../views/login/forgetPassward/ForgetPassword';
import Serach from '../views/search/Search';
// import BackEnd from '../views/backEnd/BackEnd';
import CompanySetting from '../views/backEnd/companySetting/CompanySetting';
import Organization from '../views/backEnd/organization/Organization';
import Position from '../views/backEnd/position/Position';
import ApplySettings from '../views/backEnd/applySettings/ApplySettings';
import Statistics from '../views/backEnd/statistics/Statistics';


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
            <Route path="/forgetPassword" component={ForgetPassword} />
            <Route path="/search" render={createIndexPage(Serach)} />
            <Route path="/companySetting" render={createIndexPage(CompanySetting, 'backend')} />
            <Route path="/organization" render={createIndexPage(Organization, 'backend')} />
            <Route path="/position" render={createIndexPage(Position, 'backend')} />
            <Route path="/applySettings" render={createIndexPage(ApplySettings, 'backend')} />
            <Route path="/statistics" render={createIndexPage(Statistics, 'backend')} />
        </div>
    </Router >
);

export default router;
