import React, { Component } from 'react';
import { Row, Col, Tabs } from 'antd';
import pureRender from 'pure-render-decorator';
// import ProjectStart from './ProjectStart';
import Icon from '../../../components/Icon';
import ProjectTask from './ProjectBord/projectTask';
import ProjectLender from './ProjectBord/projectLender';
import ProjectFile from './ProjectBord/projectFile';
import ProjectChat from './ProjectBord/projectChat';
import ProjectAction from './ProjectBord/projectAction';
import ProjectBordItem from './ProjectBord/projectBordItem';

const TabPane = Tabs.TabPane;
@pureRender
export default class ProjectWindow extends Component {
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
            },
        };
        return (
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
                        <TabPane tab="任务流" key="1" style={divStyle.TabStyle}>
                            <ProjectBordItem />
                            <ProjectTask style={divStyle.taskStyle} />
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
