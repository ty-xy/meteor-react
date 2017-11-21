import React, { Component } from 'react';
import { Menu } from 'antd';

import Icon from '../../../components/Icon';
import Avatar from '../../../components/Avatar';
import BaseInfo from './BaseInfo';
import MainManage from './MainManage';
import SubManage from './SubManage';
import DissolveTeam from './DissolveTeam';
import EmptyChat from '../../../components/EmptyChat';

class CompanySetting extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            current: 'baseInfo',
        };
    }
    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }
    renderSetting = (key) => {
        switch (key) {
        case 'baseInfo':
            return <BaseInfo />;
        case 'mainManage':
            return <MainManage />;
        case 'subManage':
            return <SubManage />;
        case 'task':
            return <DissolveTeam />;
        default:
            return <EmptyChat />;
        }
    }
    render() {
        return (
            <div className="company-setting">
                <div className="company-main-page">
                    <div className="logo-info">
                        <div className="logo-mark">
                            <p>中艺装饰</p>
                            <Avatar name="企业" avatarColor="red" avatar="http://oxldjnom8.bkt.clouddn.com/companyLogo.png" />
                        </div>

                    </div>
                    <div className="company-base-info">
                        <div className="base-info">
                            <p className="base-count">87</p>
                            <p>企业人数</p>
                        </div>
                        <div className="base-info">
                            <p className="base-count">7</p>
                            <p>部门数</p>
                        </div>
                    </div>
                    <div className="setting-nav">
                        <div className="title">企业设置</div>
                        <Menu
                            onClick={this.handleClick}
                            selectedKeys={[this.state.current]}
                            mode="horizontal"
                        >
                            <Menu.Item key="baseInfo">
                                <div className="set-tab">
                                    <Icon icon="icon-jibenxinxi" size={20} />
                                    <p>基本信息</p>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="mainManage">
                                <div className="set-tab">
                                    <Icon icon="icon-guanliyuan1" size={20} />
                                    <p>主管理员</p>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="subManage">
                                <div className="set-tab">
                                    <Icon icon="icon-guanliyuan" size={20} />
                                    <p>子管理员</p>
                                </div>
                            </Menu.Item>
                            <Menu.Item key="task">
                                <div className="set-tab">
                                    <Icon icon="icon-jiesanqiye" size={20} />
                                    <p>解散团队</p>
                                </div>
                            </Menu.Item>
                        </Menu>
                    </div>
                </div>
                <div className="company-info-setting">
                    {
                        this.renderSetting(this.state.current)
                    }
                </div>

            </div>
        );
    }
}

export default CompanySetting;
