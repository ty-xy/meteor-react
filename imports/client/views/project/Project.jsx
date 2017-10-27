import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import OverProject from './projectLeftSide/OverProject';
import ProjectList from './projectLeftSide/ProjectList';
import Mange from './router';

@pureRender
class Project extends Component {
    render() {
        return (
            <div className="ejianlian-project">
                <div className="left">
                    <div className="ejianlian-project-nav">
                        <OverProject />
                        <ProjectList />
                    </div>
                </div>
                <div className="ejianlian-project-window">
                    <Mange />
                </div>
            </div>
        );
    }
}

export default Project;
