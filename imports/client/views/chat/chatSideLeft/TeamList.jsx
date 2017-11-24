import React, { Component } from 'react';
import { Modal, Menu } from 'antd';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import CreateTeam from '../../../features/CreateTeam';
import Avatar from '../../../components/Avatar';
import UserUtil from '../../../../util/user';
import Company from '../../../../schema/company';

const SubMenu = Menu.SubMenu;
class TeamList extends Component {
    static propTypes = {
        handleTeamMembers: PropTypes.func,
        companyList: PropTypes.array,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            visible: false,
            currentKey: '',
        };
    }
    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            currentKey: e.key,
        });
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
    // renderSubMenu =
    renderTeamTitle = (name, logo, membersLength) => <div className="team-title"><Avatar name="企业" avatarColor="red" avatar={logo} /><p>{name}({membersLength})</p></div>
    render() {
        console.log(this.props.companyList);
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
                    <CreateTeam isShowAdd handleCancel={this.handleCancel} />
                </Modal>
                <div className="team-organization">
                    <Menu
                        onClick={this.handleClick}
                        style={{ width: 240 }}
                        mode="inline"
                        className="team-menu"
                    >
                        {
                            this.props.companyList[0] && this.props.companyList.map(company =>
                                (<SubMenu
                                    onTitleClick={() => this.props.handleTeamMembers('teamMembers', company._id)}
                                    title={this.renderTeamTitle(company.name, company.logo, company.members.length)}
                                    key={company._id}
                                />),
                            )
                        }
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

export default withTracker(() => {
    Meteor.subscribe('users');
    Meteor.subscribe('company');
    const companyIds = UserUtil.getCompanyList();
    const companyList = companyIds.map(_id =>
        Company.findOne({ _id }),
    );
    return {
        companyList,
    };
})(TeamList);
