import React from 'react';
import {
    Route,
} from 'react-router-dom';
import RouterPage from './RouterPage';
import ProjectWindow from './ProjectWindow/ProjectWindow';
import ProjectStart from './ProjectWindow/ProjectStart';
import ProjectOverFile from './ProjectWindow/ProjectBord/projectOverFile';

export default () => (
    <div style={{ height: '100%' }}>
        <Route exact path="/project" render={RouterPage(ProjectStart)} />
        <Route path="/project/task" render={RouterPage(ProjectWindow)} />
        <Route Path="/project/over" render={RouterPage(ProjectOverFile)} />
    </div>
);
