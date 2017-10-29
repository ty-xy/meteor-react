import React from 'react';
import {
    Route,
} from 'react-router-dom';
import Welcome from './component/Welcome';
import Log from './logmanage/Log';
import Notice from './notice/Notice';


export default () => (
    <div style={{ height: '100%' }}>
        <Route exact path="/manage" component={Welcome} />
        <Route path="/manage/checking" component={() => <h1>checking</h1>} />
        <Route path="/manage/logging" component={Log} />
        <Route path="/manage/notice" component={Notice} />
        <Route path="/manage/audit" render={() => <h1>audit</h1>} />
        <Route path="/manage/netdisk" render={() => <h1>net</h1>} />
        <Route path="/manage/forms" render={() => <h1>forms</h1>} />
    </div>
);
