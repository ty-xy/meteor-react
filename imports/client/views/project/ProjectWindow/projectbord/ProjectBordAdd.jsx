import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Input, Button } from 'antd';
import MyIcon from '../../../../components/Icon';
// import ProjectBordItem from './projectBordItem';
import Project from '../../../../../../imports/schema/project';

@pureRender
class ProjectBordList extends Component {
    static propTypes = {
        projectId: PropTypes.string,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            IsShowAdd: false,
            minchen: '',
        };
    }
    handleClick = () => {
        this.setState({
            IsShowAdd: !this.state.IsShowAdd,
        });
        console.log(this.state.IsShowAdd);
    }
    handleTitle = () => {
        this.createTaskBord();
        this.setState({
            IsShowAdd: !this.state.IsShowAdd,
            minchen: '',
        });
    }
    createTaskBord = () => {
        //  console.log(this.state.projectId);
        Meteor.call(
            'createTaskBoard',
            {
                name: this.state.minchen,
                projectId: this.props.projectId,
            },
            (err) => {
                console.log(err);
            },
        );
    }
    handleChange = (e) => {
        this.setState({
            minchen: e.target.value,
        });
    }

    render() {
        return (
            <div>
                <div className="ejianlian-add-item-bar">
                    <MyIcon icon="icon-jiahao" onClick={this.handleClick} />
                    <p>添加任务版</p>
                </div>
                {this.state.IsShowAdd ?
                    <div className="ejianlian-project-item">
                        <div className="project-input">
                            <Input
                                style={{ width: 225, height: 40 }}
                                placeholder="任务版名称"
                                value={this.state.minchen}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="project-button">
                            <button onClick={this.handleClick}>取消</button>
                            <Button type="primary" onClick={this.handleTitle}>确认</Button>
                        </div>
                    </div> : null}
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('project');
    const projectId = Project.findOne({})._id;
    // const projectId1 = Project.find({ name: this.state.minchen })._id;
    console.log(projectId);
    return {
        projectId,
    };
})(ProjectBordList);
