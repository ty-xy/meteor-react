import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Input } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import ProjectTitle from './component/ProjectTitle';
import Taskboard from '../../../../../../imports/schema/taskBoard';

const { TextArea } = Input;
@pureRender

class ProjectCopy extends Component {
    static propTypes ={
        hidden: PropTypes.func,
        title: PropTypes.string,
        Cclick: PropTypes.func,
        taskboard: PropTypes.arrayOf(PropTypes.object),
    }
    constructor(...props) {
        super(...props);
        this.state = {
            color: true,
        };
    }
    handleClick =(e) => {
        this.setState({
            color: !this.state.color,
        });
        if (this.state.color === true) {
            e.target.setAttribute('class', 'copy-task copy-task-color');
        } else {
            e.target.setAttribute('class', 'copy-task');
        }
        this.props.Cclick();
    }
    render() {
        return (
            <div className="project-copy-card">
                <ProjectTitle title="复制卡片" onCancel={this.props.hidden} />
                <div className="project-copy-card-body">
                    <p className="copy-table-title">标题:</p>
                    <TextArea autosize={{ minRows: 2, maxRows: 6 }} value={this.props.title} />
                    <p className="copy-table">列表:</p>
                    <ul>
                        {this.props.taskboard.map(value => (
                            <li
                                className="copy-task"
                                onClick={e => this.handleClick(e)}
                                key={value._id}
                            >{value.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default withTracker((projectId) => {
    Meteor.subscribe('taskboard');
    const taskboard = Taskboard.find({ projectId: projectId.projectId }).fetch();
    console.log(taskboard, projectId);
    return {
        taskboard,
        // taskId
    };
})(ProjectCopy);
