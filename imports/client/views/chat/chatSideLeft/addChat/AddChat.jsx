import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Meteor } from 'meteor/meteor';
import { Modal } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import AddFriend from './AddFriend';
import UserUtil from '../../../../../util/user';
import SelectMembers from '../../../../features/SelectMembers';
import Company from '../../../../../schema/company';
import fields from '../../../../../util/fields';
import feedback from '../../../../../util/feedback';

@pureRender
class AddChat extends Component {
    static propTypes = {
        team: PropTypes.array,
        changeTo: PropTypes.func,
        handleToggle: PropTypes.func,
    };
    constructor(...args) {
        super(...args);
        this.state = {
            isShowAddTooltip: false,
            isShowAddFriend: false,
            isShowAddGroup: false,
            isShowFriendCode: false,
        };
    }
    handleClick = () => {
        this.setState({
            isShowAddTooltip: !this.state.isShowAddTooltip,
        });
        document.addEventListener('click', this.closeMenu);
    }
    closeMenu = () => {
        this.setState({
            isShowAddTooltip: false,
        });
        // e.stopProPagation();
        document.removeEventListener('click', this.closeMenu);
    }
    handleAddFriend = () => {
        this.setState({
            isShowAddFriend: !this.state.isShowAddFriend,
        });
    }
    handleFriendCode = () => {
        this.setState({
            isShowFriendCode: !this.state.isShowFriendCode,
        });
    }
    handleAddGroup = () => {
        this.setState({
            isShowAddGroup: !this.state.isShowAddGroup,
        });
    }
    handleCreateGroup = async (selectedMembers) => {
        try {
            // 注意判断选中的人是否包含Meter.userId()
            const members = selectedMembers.includes(Meteor.userId()) ? selectedMembers : [Meteor.userId(), ...selectedMembers];
            const result = await Meteor.callPromise('createGroup', {
                name: `由${Meteor.user().profile.name}发起的群聊`,
                members,
            });
            await this.props.changeTo(result, result, '', 'message');
            await this.props.handleToggle(result);
            await this.handleAddGroup();
            feedback.dealSuccess('成功创建群聊');
        } catch (err) {
            feedback.dealError(err);
        }
    }
    render() {
        return (
            <div className="ejianlian-add-chat">
                <div className="chat-add-tab" style={{ display: this.state.isShowAddTooltip ? 'block' : 'none' }}>
                    <div className="arrow arrow-border" />
                    <div className="arrow arrow-bg" />
                    <p className="add-friend" onClick={this.handleAddFriend}>添加好友</p>
                    <p className="add-group" onClick={this.handleAddGroup}>发起群聊</p>
                </div>
                <div className="chat-add-user" onClick={this.handleClick}>
                    +
                </div>
                <AddFriend
                    handleAddFriend={this.handleAddFriend}
                    handleFriendCode={this.handleFriendCode}
                    isShowAddFriend={this.state.isShowAddFriend}
                    isShowFriendCode={this.state.isShowFriendCode}
                />

                <Modal
                    title="发起群聊"
                    visible={this.state.isShowAddGroup}
                    onCancel={this.handleAddGroup}
                    width={430}
                    wrapClassName="create-team-mask"
                    footer={null}
                >
                    <SelectMembers
                        confirmSelected={this.handleCreateGroup}
                        team={this.props.team}

                    />
                </Modal>

            </div>
        );
    }
}


export default withTracker(() => {
    Meteor.subscribe('company');
    Meteor.subscribe('users');
    const friendIds = UserUtil.getFriends();
    const friends = [
        {
            name: 'e建联好友',
            members: friendIds,
            department: [], // 不存在的时候需要传一个空数组
        },
    ];
    const companyListIds = UserUtil.getCompanyList();
    const companyList = companyListIds.map(companyId => Company.findOne(
        { _id: companyId },
        { fields: fields.searchCompany },
    ));
    if (companyList[0]) {
        const teams = companyList.map((company) => {
            const members = company.members;
            const name = company.name;
            const memberIds = [];
            for (const value of Object.values(members)) {
                memberIds.push(value.userId);
            }
            const deps = company.deps || [];
            const department = deps.map((depId) => {
                const depMembers = members.filter(x => x.dep === depId.id);
                const depMemberIds = [];
                for (const value of Object.values(depMembers)) {
                    depMemberIds.push(value.userId);
                }
                return {
                    name: depId.name,
                    members: depMemberIds,
                };
            });
            /*
            1,不存在部门
            2,存在部门但是部门里面没有人
            */
            return {
                name,
                members: memberIds,
                department,
            };
        });
        const team = friends.concat(teams);
        return {
            team,
        };
    }
    const team = friends;
    return {
        team,
    };
})(AddChat);
