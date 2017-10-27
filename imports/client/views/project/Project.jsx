import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
// import PropTypes from 'prop-types';
import OverProject from './projectLeftSide/OverProject';
import ProjectList from './projectLeftSide/ProjectList';
import ProjectWindow from './ProjectWindow/ProjectWindow';
// import ProjectStart from './ProjectWindow/ProjectStart';
import ProjectOverFile from './ProjectWindow/ProjectBord/projectOverFile';
// import Mange from './router';

@pureRender
class Project extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            visiblel: false,
            showTask: false,
        };
    }
    handleChange = () => {
        this.setState({
            visiblel: !this.state.visiblel,
        });
    }
    handleClick = () => {
        this.setState({
            showTask: !this.state.showTask,
        });
    }
    render() {
        return (
            <div className="ejianlian-project">
                <div className="left">
                    <div className="ejianlian-project-nav">
                        <OverProject showProject={this.handleChange} />
                        <ProjectList showProject={this.handleClick} />
                    </div>
                </div>
                <div className="ejianlian-project-window">
                    {/* <div className="ejianlian-project-start" style={{ zIndex: 1 }}>
                        <p>开启您的团队协作之旅</p>
                        <p><img src="/start.jpg" /></p>
                    </div> */}
                    {this.state.visiblel ?
                        <ProjectOverFile style={{ zIndex: 100 }} /> : null}
                    {/* <Mange /> */}
                    {this.state.showTask ?
                        <ProjectWindow style={{ zIndex: 100 }} /> : null}
                    {/* <Mange /> */}
                </div>
            </div>
        );
    }
}

export default Project;
