import React from 'react';
import {
    Route,
} from 'react-router-dom';
import ProjectWindow from './ProjectWindow/ProjectWindow';
import ProjectStart from './ProjectWindow/ProjectStart';
import ProjectOverFile from './ProjectWindow/ProjectBord/projectOverFile';

export default () => (
    <div style={{ height: '100%', position: 'relative' }}>
        <Route exact path="/project" component={ProjectStart} />
        <Route path="/project/task/:id" component={ProjectWindow} />
        <Route path="/project/over" component={ProjectOverFile} />
    </div>
);
