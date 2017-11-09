import React, { Component } from 'react';
import { Row, Col, Tabs, Modal } from 'antd';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import Icon from '../../../components/Icon';
import ProjectBordAdd from './ProjectBord/ProjectBordAdd';
import ProjectLender from './ProjectBord/projectLender';
import ProjectFile from './ProjectBord/projectFile';
import ProjectChat from './ProjectBord/projectChat';
import ProjectAction from './ProjectBord/projectAction';
import ProjectBordItem from './ProjectBord/projectBordItem';
import TaskBoard from '../../../../../imports/schema/taskBoard';
import Project from '../../../../../imports/schema/project';
import ProjectSet from './ProjectBord/ProjectSet';

const TabPane = Tabs.TabPane;
@pureRender
class ProjectWindow extends Component {
    static propTypes = {
        taskF: PropTypes.arrayOf(PropTypes.object),
        // project: PropTypes.object,
        projectL: PropTypes.arrayOf(PropTypes.object),
    }
    constructor(...args) {
        super(...args);
        this.state = {
            visible: false,
            id: '',
        };
    }
    componentWillReceiveProps(projectd) {
        console.log('nextProps', projectd.match.params.id);
        this.setState({
            id: projectd.match.params.id,
        });
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    hideModal =() => {
        this.setState({
            visible: false,
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
                {this.props.projectL.map((project, index) => {
                    console.log(111);
                    return (<div className="window-title" key={index} >
                        <Row>
                            <Col span={22}><p>{project.name}</p></Col>
                            <Col span={1}> <Icon icon="icon-qunzu" className="icon-one" /></Col>
                            <Col span={1}> <Icon icon="icon-shezhi" className="icon-two" onClick={this.showModal} />
                                <Modal
                                    visible={this.state.visible}
                                    footer={null}
                                    onOk={this.hideModal}
                                    onCancel={this.hideModal}
                                    bodyStyle={{ padding: 0 }}
                                    width={450}
                                >
                                    <ProjectSet setId={project._id} />
                                </Modal>
                            </Col>
                        </Row>
                    </div>);
                })}

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
                            <ProjectBordAdd style={divStyle.taskStyle} pId={this.state.id} />
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
    console.log(project, projectL);
    // console.log(projectd.match.params.id);
    return {
        taskF,
        taskL,
        project,
        projectL,
    };
})(ProjectWindow);
