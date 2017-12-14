import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import DefaultProject from './DefaultProject';
import MyIcon from '../../../components/Icon';

import Project from '../../../../../imports/schema/project';
import ProjectMember from '../../../../../imports/schema/projectmember';

@pureRender
class ProjectList extends Component {
    static propTypes = {
        showProject: PropTypes.func,
        project: PropTypes.arrayOf(PropTypes.object),
        // projects: PropTypes.arrayOf(PropTypes.object),
    }
    constructor(...props) {
        super(...props);
        this.state = {
            visible: true,
            showDefault: true,
        };
    }
    handleClick = () => {
        this.setState({
            showDefault: false,
        });
    }
    render() {
        return (
            <div className="ejianlian-project-list" onClick={this.props.showProject}>
                {this.state.showDefault ?
                    <Link to="/project/task">
                        <DefaultProject click={this.handleClick} />
                    </Link> : null}
                {this.props.project && this.props.project.length > 0 ?
                    <ul >
                        {
                            this.props.project.map((value) => {
                                if (value.headPortrait && value.headPortrait.indexOf('icon') === -1 && value.pigeonhole === 1) {
                                    return (
                                        <Link to={`/project/task/${value.uprojectId}`} key={value._id}>
                                            <li className="list-item" key={value._id}>
                                                <div className="list-img">
                                                    {<img src={`http://oxldjnom8.bkt.clouddn.com//${value.headPortrait}`} alt="" />}
                                                </div>
                                                <div className="list-right">
                                                    <p>{value.name}</p>
                                                </div>
                                            </li>
                                        </Link>
                                    );
                                } else if (value.headPortrait && value.headPortrait.indexOf('icon') === 0 && value.pigeonhole === 1) {
                                    return (
                                        <Link to={`/project/task/${value.uprojectId}`} key={value._id}>
                                            <li className="list-item" key={value._id}>
                                                <div className="list-img-icon">
                                                    {<MyIcon icon={`${value.headPortrait} icon`} size={24} iconColor="#fff" />}
                                                </div>
                                                <div className="list-right">
                                                    <p>{value.name}</p>
                                                </div>
                                            </li>
                                        </Link>
                                    );
                                }
                                return null;
                            })

                        }
                    </ul> :
                    <div className="example">
                        <Spin tip="Loading..." />
                    </div>
                }
            </div >
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('project');
    Meteor.subscribe('notice');
    Meteor.subscribe('projectmember');
    const projectId = ProjectMember.find({ member: Meteor.userId() }).fetch();
    console.log(projectId);
    const project = [];
    projectId.map((item) => {
        const project1 = Project.find({ uprojectId: item.projectId }, { sort: { createTime: -1 } }).fetch();
        if (project1[0] !== undefined) {
            return project.unshift(project1[0]);
        }
        return null;
    });
    const projects = Project.find({ }, { sort: { createTime: -1 } }).fetch();
    console.log(project);
    return {
        projects,
        project,
    };
})(ProjectList);
