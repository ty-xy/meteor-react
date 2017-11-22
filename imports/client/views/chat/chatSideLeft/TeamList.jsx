import React, { Component } from 'react';
import { Modal, Menu } from 'antd';
import PropTypes from 'prop-types';

import CreateTeam from '../../../features/CreateTeam';
import Avatar from '../../../components/Avatar';

const SubMenu = Menu.SubMenu;
class TeamList extends Component {
    static propTypes = {
        handleTeamMembers: PropTypes.func,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            visible: false,
        };
    }
    handleClick = (e) => {
        console.log('click ', e);
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    render() {
        return (
            <div className="team-list">
                <div className="create-team-btn">
                    <button onClick={this.showModal}>创建新团队</button>
                </div>
                <Modal
                    title="创建团队"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    wrapClassName="create-team-mask"
                    footer={null}
                >
                    <CreateTeam isShowAdd />
                </Modal>
                <div className="team-organization">
                    <Menu
                        onClick={this.handleClick}
                        style={{ width: 240 }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        className="team-menu"
                    >
                        <SubMenu
                            onTitleClick={this.props.handleTeamMembers('teamMembers')}
                            title={<div className="team-title"><Avatar name="企业" avatarColor="red" avatar="http://oxldjnom8.bkt.clouddn.com/companyLogo.png" /><p>知工网络科技有限公司(0)</p></div>}
                            key="sub1"
                        >
                            <Menu.Item key="1">总裁办</Menu.Item>
                            <Menu.Item key="2">财务部</Menu.Item>
                            <Menu.Item key="3">人力资源</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title={<div className="team-title"><Avatar name="企业" avatarColor="red" avatar="http://oxldjnom8.bkt.clouddn.com/companyLogo.png" /><p>知工网络科技有限公司(0)</p></div>} />
                        <SubMenu key="sub4" title={<div className="team-title"><Avatar name="企业" avatarColor="red" avatar="http://oxldjnom8.bkt.clouddn.com/companyLogo.png" /><p>知工网络科技有限公司(0)</p></div>}>
                            <Menu.Item key="9">Option 9</Menu.Item>
                            <Menu.Item key="10">Option 10</Menu.Item>
                            <Menu.Item key="11">Option 11</Menu.Item>
                            <Menu.Item key="12">Option 12</Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
            </div>
        );
    }
}

export default TeamList;
