import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
// import { Spin } from 'antd';
// import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
// import PropTypes from 'prop-types';
// import AddProject from './Addproject';
import DefaultProject from './DefaultProject';

import Project from '../../../../../imports/schema/project';

@pureRender
class ProjectList extends Component {
    static propTypes = {
        showProject: PropTypes.func,
        projects: PropTypes.arrayOf(PropTypes.object),
    }
    constructor(...props) {
        super(...props);
        this.state = {
            visible: true,
        };
    }
    render() {
        return (
            <div className="ejianlian-project-list" onClick={this.props.showProject}>
                <DefaultProject />
                <ul >
                    {
                        this.props.projects.map((value) => {
                            console.log(1);
                            return (
                                <li className="list-item" key={value._id}>
                                    <div className="list-img">
                                        <img src="http://img.duoziwang.com/2016/10/02/15235311191.jpg" alt="" />
                                    </div>
                                    <div className="list-right">
                                        <p>{value.name}</p>
                                    </div>
                                </li>
                            );
                        })
                    }
                </ul>
            </div >
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('project');
    const projects = Project.find({}).fetch();
    console.log(projects[0]);
    return {
        projects,
    };
})(ProjectList);
