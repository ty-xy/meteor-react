import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import DefaultProject from './DefaultProject';
import MyIcon from '../../../components/Icon';

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
                <ul >
                    {
                        this.props.projects.map((value) => {
                            if (value.headPortrait.indexOf('icon') === -1 && value.pigeonhole === 1) {
                                return (
                                    <Link to={`/project/task/${value._id}`} key={value._id}>
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
                            } else if (value.headPortrait.indexOf('icon') === 0 && value.pigeonhole === 1) {
                                return (
                                    <Link to={`/project/task/${value._id}`} key={value._id}>
                                        <li className="list-item" key={value._id}>
                                            <div className="list-img-icon">
                                                {<MyIcon icon={`${value.headPortrait} icon`} size={30} iconColor="#ddd" />}
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
                        // }
                        // 

                    }
                </ul>
            </div >
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('project');
    const projects = Project.find({}, { sort: { createTime: -1 } }).fetch();
    console.log(projects[0]);
    return {
        projects,
    };
})(ProjectList);
