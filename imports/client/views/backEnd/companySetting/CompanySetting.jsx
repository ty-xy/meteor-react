import React, { Component } from 'react';
import { Menu } from 'antd';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';


import Icon from '../../../components/Icon';
import Avatar from '../../../components/Avatar';
import BaseInfo from './BaseInfo';
import MainManage from './MainManage';
import SubManage from './SubManage';
import DissolveTeam from './DissolveTeam';
import EmptyChat from '../../../components/EmptyChat';

import UserUtil from '../../../../util/user';
import Company from '../../../../schema/company';
// import fields from '../../../../util/fields';

@pureRender
class CompanySetting extends Component {
    static propTypes = {
        currentCompany: PropTypes.object,
    }
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
        const { name = '', logo = 'http://oxldjnom8.bkt.clouddn.com/companyLogo.png', members = [], deps = [] } = this.props.currentCompany || {};
        return (
            <div className="company-setting">
                <div className="company-main-page">
                    <div className="logo-info">
                        <div className="logo-mark">
                            <p>{name}</p>
                            <Avatar name={name} avatarColor="red" avatar={logo} />
                        </div>

                    </div>
                    <div className="company-base-info">
                        <div className="base-info">
                            {
                                members && members.length ?
                                    <p className="base-count">{members.length }</p>
                                    :
                                    <p className="base-count">0</p>
                            }
                            <p>企业人数</p>
                        </div>
                        <div className="base-info">
                            {
                                deps && deps.length ?
                                    <p className="base-count">{deps.length }</p>
                                    :
                                    <p className="base-count">0</p>
                            }
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

export default withTracker(() => {
    Meteor.subscribe('company');
    const currentCompanyId = UserUtil.getCurrentBackendCompany();
    const currentCompany = Company.findOne({ _id: currentCompanyId });
    return {
        currentCompany,
    };
})(CompanySetting);
