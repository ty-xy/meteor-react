import React from 'react';
import {
    Route,
} from 'react-router-dom';
import Welcome from './component/Welcome';
import Log from './logmanage/Log_';
import Notice from './notice/Notice';
import Audit from './audit/Audit';


export default () => (
    <div style={{ height: '100%' }}>
        <Route exact path="/manage" component={Welcome} />
        <Route path="/manage/checking" component={() => <h1>正在开发中。。。</h1>} />
        <Route path="/manage/logging" component={Log} />
        <Route path="/manage/notice" component={Notice} />
        <Route path="/manage/audit" component={Audit} />
        <Route path="/manage/netdisk" render={() => <h1>正在开发中。。。</h1>} />
        <Route path="/manage/forms" render={() => <h1>正在开发中。。。</h1>} />
    </div>
);
