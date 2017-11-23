import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Input, Button } from 'antd';
import MyIcon from '../../../../components/Icon';
import Project from '../../../../../../imports/schema/project';

@pureRender
class ProjectBordList extends Component {
    static propTypes = {
        // projectId: PropTypes.arrayOf(PropTypes.object),
        pId: PropTypes.string,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            IsShowAdd: false,
            minchen: '',
        };
    }
    handleClick = () => {
        if (this.props.pId) {
            this.setState({
                IsShowAdd: !this.state.IsShowAdd,
            });
        }
        console.log(this.props.pId);
    }
    handleTitle = () => {
        this.createTaskBord();
        this.setState({
            IsShowAdd: !this.state.IsShowAdd,
            minchen: '',
        });
    }
    createTaskBord = () => {
        Meteor.call(
            'createTaskBoard',
            {
                name: this.state.minchen,
                projectId: this.props.pId,
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
            <div style={{ marginLeft: '30px' }}>
                <div className="ejianlian-add-item-bar" onClick={this.handleClick}>
                    <MyIcon icon="icon-jiahao" />
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
    const projectId = Project.findOne({});
    console.log(projectId);
    return {
        projectId,
    };
})(ProjectBordList);
