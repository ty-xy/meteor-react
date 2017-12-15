import React, { Component } from 'react';
import { Row, Col, Tabs, Modal } from 'antd';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import Icon from '../../../components/Icon';
// import ProjectBordAdd from './ProjectBord/ProjectBordAdd';
import ProjectLender from './ProjectBord/projectLender';
import ProjectFile from './ProjectFile/projectFile';
import ProjectChat from './projectChat/projectChat';
import ProjectAction from './ProjectBord/projectAction';
import Board from './ProjectBord/Board';
import Project from '../../../../../imports/schema/project';
import ProjectSet from './ProjectBord/ProjectSet';
import ProjectMembers from './ProjectBord/projectMembers';

const TabPane = Tabs.TabPane;
@pureRender
class ProjectWindow extends Component {
    static propTypes = {
        projectd: PropTypes.object,
        // project: PropTypes.object,
        projectL: PropTypes.arrayOf(PropTypes.object),
        //  projectd: PropTypes.arrayOf(PropTypes.object),
    }
    constructor(...args) {
        super(...args);
        this.state = {
            visible: false,
            id: '',
            see: false,
        };
    }
    componentWillMount() {
        this.setState({
            id: this.props.projectd.match.params.id,
        });
    }
    componentWillReceiveProps(Projectd) {
        console.log('nextProps', Projectd.match.params.id);
        this.setState({
            id: Projectd.match.params.id,
        });
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    showMo = () => {
        this.setState({
            see: true,
        });
    }
    hideOk =() => {
        this.setState({
            see: false,
        });
    }
    hideModal =() => {
        this.setState({
            visible: false,
        });
    }
    render() {
        const divStyle = {
            TabStyle: {
                display: 'flex',
                marginTop: '10px',
            },
        };
        return (
            <div className="ejianlian-project-window-show" key={Math.random()}>
                {this.props.projectL.map((project) => {
                    console.log('');
                    return (<div className="window-title" key={project._id} >
                        <Row>
                            <Col span={22}><p>{project.name}</p></Col>
                            <Col span={1}> <Icon icon="icon-qunzu icon-one" onClick={this.showMo} size={20} />
                                <Modal
                                    visible={this.state.see}
                                    footer={null}
                                    onOk={this.hideOk}
                                    onCancel={this.hideOk}
                                    className="modal-reset"
                                    mask={false}
                                    style={{ top: 0, right: 0, position: 'absolute', height: '100%' }}
                                    bodyStyle={{ padding: 0 }}
                                    width={375}
                                >
                                    <ProjectMembers
                                        member={project.members}
                                        projectId={project.uprojectId}
                                        members={project.members}
                                    />
                                </Modal>
                            </Col>
                            <Col span={1}> <Icon icon="icon-shezhi icon-one" onClick={this.showModal} size={20} />
                                <Modal
                                    visible={this.state.visible}
                                    footer={null}
                                    onOk={this.hideModal}
                                    key={project._id}
                                    onCancel={this.hideModal}
                                    bodyStyle={{ padding: 0 }}
                                    width={450}
                                >
                                    <ProjectSet setId={project._id} ProjectId={project.uprojectId} click={this.hideModal} />
                                </Modal>
                            </Col>
                        </Row>
                    </div>);
                })}

                <div className="ejianlian-body-tab">
                    <Tabs defaultActiveKey="1" className="tab-task" >
                        <TabPane tab="任务流" key="1" style={divStyle.TabStyle} className="task-scroll-auto">
                            <Board pId={this.state.id} />
                            {/* <ProjectBordAdd pId={this.state.id} /> */}
                        </TabPane>
                        <TabPane tab="日历" key="2">
                            <ProjectLender />
                        </TabPane>
                        <TabPane tab="文件" key="3">
                            <ProjectFile pId={this.state.id} />
                        </TabPane>
                        <TabPane tab="群聊" key="4" className="task-chat-height">
                            <ProjectChat pId={this.state.id} />
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
    Meteor.subscribe('project');
    const projectL = Project.find({ uprojectId: projectd.match.params.id }).fetch();
    const project = projectL[0];
    return {
        project,
        projectL,
        projectd,
    };
})(ProjectWindow);
