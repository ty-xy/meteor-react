import React, { Component } from 'react';
import { Row, Col, Tabs } from 'antd';
import pureRender from 'pure-render-decorator';
import ProjectStart from './ProjectStart';
import Icon from '../../../components/Icon';
import ProjectTask from './projectbord/projectTask';
import ProjectLender from './projectbord/projectLender';
import ProjectFile from './projectbord/projectFile';
import ProjectChat from './projectbord/projectChat';
import ProjectAction from './projectbord/projectAction';

const TabPane = Tabs.TabPane;
@pureRender
export default class ProjectWindow extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            IsShowInfo: false,
        };
    }
    handleClick = () => {
        this.SetState({
            IsShowInfo: true,
        });
    }
    render() {
        return (
            <div>
                {this.state.IsShowInfo ?
                    <div className="ejianlian-project-window-show">
                        <div className="window-title">
                            <Row>
                                <Col span={22}><p>金碧堂酒店改造项目（翠微路)</p></Col>
                                <Col span={1}> <Icon icon="icon-qunzu" className="icon-one" /></Col>
                                <Col span={1}> <Icon icon="icon-shezhi" className="icon-two" /></Col>
                            </Row>
                        </div>
                        <div className="ejianlian-body-tab">
                            <Tabs defaultActiveKey="1" className="tab-task" >
                                <TabPane tab="任务流" key="1">
                                    <ProjectTask />
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
                    </div> : <ProjectStart />
                }
            </div>
        );
    }
}
