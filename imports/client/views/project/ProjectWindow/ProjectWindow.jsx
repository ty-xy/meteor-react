import React, { Component } from 'react';
import { Row, Col, Tabs } from 'antd';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
// import ProjectStart from './ProjectStart';
import Icon from '../../../components/Icon';
import ProjectBordAdd from './ProjectBord/ProjectBordAdd';
// import ProjectTask from './ProjectBord/projectTask';
import ProjectLender from './ProjectBord/projectLender';
import ProjectFile from './ProjectBord/projectFile';
import ProjectChat from './ProjectBord/projectChat';
import ProjectAction from './ProjectBord/projectAction';
import ProjectBordItem from './ProjectBord/projectBordItem';
import TaskBoard from '../../../../../imports/schema/taskBoard';
import Project from '../../../../../imports/schema/project';

const TabPane = Tabs.TabPane;
@pureRender
class ProjectWindow extends Component {
    static propTypes = {
        taskF: PropTypes.arrayOf(PropTypes.object),
        project: PropTypes.array,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            IsShowInfo: true,
        };
    }
    handleClick = () => {
        this.SetState({
            IsShowInfo: true,
        });
    }

    render() {
        const divStyle = {
            taskStyle: { marginLeft: '30px' },
            TabStyle: {
                display: 'flex',
                marginTop: '10px',
            },
        };
        return (
            <div className="ejianlian-project-window-show">
                <div className="window-title">
                    <Row>
                        <Col span={22}><p>{this.props.project.name}</p></Col>
                        <Col span={1}> <Icon icon="icon-qunzu" className="icon-one" /></Col>
                        <Col span={1}> <Icon icon="icon-shezhi" className="icon-two" /></Col>
                    </Row>
                </div>
                <div className="ejianlian-body-tab">
                    <Tabs defaultActiveKey="1" className="tab-task" >
                        <TabPane tab="任务流" key="1" style={divStyle.TabStyle}>
                            {
                                this.props.taskF.map((text) => {
                                    console.log(text._id);
                                    return (
                                        <ProjectBordItem value={text.name} tastBoardId={text._id} key={text._id} />
                                    );
                                })

                            }
                            <ProjectBordAdd style={divStyle.taskStyle} pId={this.props.project._id} />
                        </TabPane>
                        <TabPane tab="日历" key="2">
                            <ProjectLender />
                        </TabPane>
                        <TabPane tab="文件" key="3">
                            <ProjectFile />
                        </TabPane>
                        <TabPane tab="群聊" key="4">
                            <ProjectChat />
                        </TabPane>
                        <TabPane tab="动态" key="5">
                            <ProjectAction />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}
export default withTracker((projectd) => {
    Meteor.subscribe('taskboard');
    Meteor.subscribe('project');
    const taskF = TaskBoard.find({ projectId: projectd.match.params.id }).fetch();
    const taskL = taskF.length;
    const projectL = Project.find({ _id: projectd.match.params.id }).fetch();
    // const projectId1 = Project.find({ name: this.state.minchen })._id;
    const project = projectL[0];
    console.log(taskF, project);
    console.log(projectd.match.params.id);
    return {
        taskF,
        taskL,
        project,
    };
})(ProjectWindow);
