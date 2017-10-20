import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import ProjectStart from './ProjectStart';
import ProjectBordAdd from './ProjectBordAdd';


@pureRender
export default class ProjectWindow extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            IsShowInfo: false,
        };
    }
    handleClick = () => {
        this.SetState({
            IsShowInfo: true,
        });
    }
    render() {
        return (
            <div className="ejianlian-project-window">
                {this.state.IsShowInfo ?
                    <ProjectStart /> :
                    <ProjectBordAdd />}
            </div>
        );
    }
}
