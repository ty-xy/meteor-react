import React, { Component } from 'react';
import { Row, Col, Input, Calendar, Menu, Dropdown, Checkbox } from 'antd';
import pureRender from 'pure-render-decorator';
import AvatarSelf from '../../../../components/AvatarSelf';
import Icon from '../../../../components/Icon';
import ProjectInput from './projectInput';

const { TextArea } = Input;
function onPanelChange(value, mode) {
    console.log(value, mode);
}

@pureRender
class ProjectItemDetail extends Component {
    constructor(...props) {
        super(...props);
        this.state = {
            shown: false,
            shownT: false,
            shownR: true,
            shownLender: false,
        };
    }
    handleLender = () => {
        this.setState({
            shownLender: !this.state.shownLender,
        });
    }
    handleChangeS = () => {
        this.setState({
            shown: !this.state.shown,
        });
    }
    handleChangeT = () => {
        this.setState({
            shownT: !this.state.shownT,
        });
    }
    handleChangeR = () => {
        this.setState({
            shownR: !this.state.shownR,
        });
    }
    handleChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    卡片操作
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="1">
                    <a href="http://www.taobao.com/">关注</a>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="2">编辑成员</Menu.Item>
                <Menu.Item key="3">编辑标签</Menu.Item>
                <Menu.Item key="4">编辑附件</Menu.Item>
                <Menu.Item key="5" onClick={this.handleLender}>修改起始日期
                </Menu.Item>
                <Menu.Item key="6">修改截止日期</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="7">移到顶部</Menu.Item>
                <Menu.Item key="8">移到底部</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="9">移到卡片</Menu.Item>
                <Menu.Item key="10">复制卡片</Menu.Item>
                <Menu.Item key="11">归档卡片</Menu.Item>
            </Menu>
        );
        return (
            <div className="ejian-lian-project-detail">
                <div className="detail-title detail-common">
                    <Row>
                        <Col span={20}>
                            <h1>项目评估</h1>
                        </Col>
                        <Col span={4}>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <Icon icon="icon-gengduo1" />
                            </Dropdown>
                        </Col>
                    </Row>
                </div>
                <div className="modal-detail-content detail-common">
                    <Row className="detail-list-common">
                        <Col span={6}>
                            <p>成员</p>
                            <div style={{ display: 'flex' }}>
                                <div className="person-size">
                                    <AvatarSelf />
                                </div>
                                <Icon icon="icon-tianjia circle-icon" />
                            </div>
                        </Col>
                        <Col span={6}>
                            <p>标签</p>
                            <div style={{ display: 'flex' }}>
                                <p className="circle-icon-l" />
                                <Icon icon="icon-tianjia circle-icon" />
                            </div>
                        </Col>
                        <Col span={6}>
                            <p>开始</p>
                            <div>
                                今天中午12点30分
                            </div>
                        </Col>
                        <Col span={6}>
                            <p>结束</p>
                            <div>
                                2017年10月25日
                            </div>
                        </Col>
                    </Row>
                    <div className="detail-list-common detail-list-decription">
                        <p>
                            描述
                        </p>
                        {
                            this.state.shown ?
                                <ProjectInput input="添加" onClick={this.handleChangeS} /> :
                                <input type="button" value="编辑" className="input-decription" onClick={this.handleChangeS} />
                        }
                    </div>
                    <div className="detail-list-common">
                        <p>清单</p>
                        <div>
                            <Checkbox onChange={this.handleChange}>西红门板材报价</Checkbox>
                            <div style={{ paddingLeft: '20px' }}>
                                <p>
                                    <Checkbox onChange={this.handleChange}>一楼管材汇总</Checkbox>
                                </p>
                                <Checkbox onChange={this.handleChange}>二楼管材汇总</Checkbox>

                                {this.state.shownT ?
                                    <ProjectInput input="添加" onClick={this.handleChangeT} /> :
                                    <p>
                                        <Icon icon="icon-tianjia1" onClick={this.handleChangeT} />
                                        扩充清单
                                    </p>
                                }
                            </div>
                        </div>
                        {this.state.shownR ?
                            <p className="ready-task">
                                <Icon icon="icon-tianjia1" onClick={this.handleChangeR} />
                                添加待办事项
                            </p> : <ProjectInput input="添加" onClick={this.handleChangeR} />
                        }
                    </div>
                    <div className="detail-list-common detail-comment">
                        <p className="comment-title">活动</p>
                        <div>
                            <div style={{ display: 'flex' }}>
                                <div className="person-size">
                                    <AvatarSelf />
                                </div>
                                <TextArea type="text" />
                            </div>
                            <button className="comment-button">评论</button>
                        </div>
                        <div style={{ display: 'flex' }} className="comment-talk">
                            <div className="person-size">
                                <AvatarSelf />
                            </div>
                            <div>
                                <p>二楼材料已经汇总</p>
                                <span>10分钟以前</span>
                                <span>--</span>
                                <a>编辑</a>
                                <span>--</span>
                                <a>删除</a>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.shownLender ? <Calendar fullscreen={false} onPanelChange={onPanelChange} /> : null}
            </div>
        );
    }
}
export default ProjectItemDetail;

