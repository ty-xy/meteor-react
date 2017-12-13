import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { Switch, Modal } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Icon from '../../../components/Icon';
import Avatar from '../../../components/Avatar';
import UserUtil from '../../../../util/user';
import feedback from '../../../../util/feedback';
import SelectOne from '../../../features/SelectOne';
import SelectMembers from '../../../features/SelectMembers';
import Company from '../../../../schema/company';
import fields from '../../../../util/fields';
import Group from '../../../../schema/group';
import avatarUrl from '../../../../util/avatarUrl';

@pureRender
class GroupSetting extends Component {
    static propTypes = {
        showGroupSet: PropTypes.func,
        groupName: PropTypes.string,
        groupMembers: PropTypes.array,
        groupMemberIds: PropTypes.array,
        groupId: PropTypes.string,
        admin: PropTypes.string,
        isDisturb: PropTypes.bool,
        stickTop: PropTypes.object,
        avatar: PropTypes.string,
        changeTo: PropTypes.func,
        handleFriendIdInfo: PropTypes.func,
        team: PropTypes.array,
        handleToggle: PropTypes.func,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isShowAddMembers: false,
            isShowSeleteAdmin: false,
            restUserIds: [],
            teamMemberIds: [],
            isChangeName: false,
        };
    }
    setNotDisturb = (checked) => {
        // console.log('设置了消息免打扰', checked);
        Meteor.call('changeGroupDisturb', this.props.groupId, checked, (err) => {
            feedback.dealError(err);
        });
    }
    setGroupFirst = (checked) => {
        // console.log('设置了当前群聊置顶', checked);
        Meteor.call('changeGroupStickTop', this.props.groupId, checked, (err) => {
            feedback.dealError(err);
        });
    }
    // 选择新的群主
    selectAdmin = () => {
        const { groupMemberIds } = this.props;
        const teamMemberIds = groupMemberIds.filter(x => x !== Meteor.userId());
        this.setState({
            isShowSeleteAdmin: true,
            teamMemberIds,
        });
    }
    closeSeleteAdmin = () => {
        this.setState({
            isShowSeleteAdmin: false,
        });
    }
    // 确认选择新的群主
    confirmChange = (newAdminId) => {
        this.setState({
            isShowSeleteAdmin: false,
        });
        Meteor.call('changeAdmin', this.props.groupId, newAdminId, (err) => {
            if (err) {
                console.error(err.reason);
            }
            feedback.dealSuccess('修改成功');
        });
    }
    // 邀请更多好友
    handleAddMembers = () => {
        this.setState({
            isShowAddMembers: true,
        });
    }
    closeAddMembers = () => {
        this.setState({
            isShowAddMembers: false,
        });
    }
    // 添加更多群成员
    addMembers = (newMemberIds) => {
        Meteor.call('addGroupMembers',
            {
                groupId: this.props.groupId,
                newMemberIds,
            },
            (err) => {
                if (err) {
                    console.error(err.reason);
                }
                feedback.dealSuccess('添加成功');
            },
        );
    }
    deleteMember = (memberId, content) => {
        Meteor.call('deleteMember', this.props.groupId, memberId, (err) => {
            if (err) {
                console.error(err.reason);
            }
            feedback.dealSuccess(content);
        });
    }
    // 解散群聊
    deleteGroup = () => {
        feedback.dealDelete('解散群聊', '您确定解散该群聊?', () => {
            Meteor.call('deleteGroup', this.props.groupId, (err) => {
                if (err) {
                    console.error(err.reason);
                }
                feedback.dealSuccess('解散群聊成功');
                this.props.showGroupSet();
                this.props.changeTo('', '');
            });
        });
    }
    // 移除群成员
    handleDeleteMember = (memberId) => {
        feedback.dealDelete('移出成员', '您确定移除该成员?', () => this.deleteMember(memberId, '移除成功'));
    }
    // 确认退出群聊后,群设置弹窗消失,聊天窗口消失
    confirmExit = () => {
        this.deleteMember(Meteor.userId(), '退出成功');
        this.props.changeTo('', '');
        this.props.showGroupSet();
    }
    // 退出群聊
    exitGroupChat = () => {
        if (this.props.admin === Meteor.userId()) {
            feedback.dealWarning('您需要先转让群主，才可退出该群聊');
        } else {
            feedback.dealDelete('退出群聊', '您确定退出该群聊?', () => this.confirmExit());
        }
    }
    editGroupName = () => {
        this.setState({
            isChangeName: !this.state.isChangeName,
        });
    }
    saveChangeName = () => {
        Meteor.call('changeGroupName', this.props.groupId, this.newGroupName.value, (err) => {
            console.log(err);
        });
    }
    chooseNewGroupAvatar = (e) => {
        const image = e.target.files[0];
        if (!image) {
            return;
        }

        const reader = new FileReader();

        const groupId = this.props.groupId;

        reader.onloadend = function () {
            Meteor.call('changeGroupAvatar', this.result, groupId, (err) => {
                if (err) {
                    return console.error(err.reason);
                }
                console.log('修改头像成功');
            });
        };
        reader.readAsDataURL(image);
    }
    render() {
        return (
            <div className="group-setting-block">
                <div className=" container-content">
                    <div className="group-info">
                        <div className="group-base-info">
                            <div className="group-avatar-wrap">
                                <Avatar avatar={this.props.avatar ? this.props.avatar : avatarUrl.avatarGroup} name="群聊" />
                                {
                                    this.props.admin === Meteor.userId() ?
                                        <div className="choose-new-avatar">
                                            <Icon icon="icon-jiahao" iconColor="#fff" size={20} />
                                            <input type="file" onChange={this.chooseNewGroupAvatar} />
                                        </div>
                                        :
                                        null
                                }
                            </div>
                            {
                                this.state.isChangeName ?
                                    <input type="text" defaultValue={this.props.groupName} onBlur={this.saveChangeName} ref={i => this.newGroupName = i} /> :
                                    <p>
                                        {this.props.groupName}
                                    </p>
                            }
                        </div>
                        {
                            this.props.admin === Meteor.userId() ?
                                <button onClick={this.editGroupName}>编辑</button>
                                :
                                null
                        }

                    </div>
                    <div className="group-members">
                        <p>群成员{this.props.groupMembers.length}人</p>
                        <p className="all">全部成员</p>
                    </div>
                    <div className="members-avatar">
                        {
                            this.props.groupMembers.map((item, i) =>
                                (item.profile ?
                                    <div className="avatar-wrap" key={i}>
                                        <div onClick={() => {
                                            this.props.handleFriendIdInfo(item._id);
                                            this.props.handleToggle(item._id);
                                        }}
                                        >
                                            <Avatar name={item.profile.name} avatarColor={item.profile.avatarColor} avatar={item.profile.avatar} />
                                        </div>

                                        {
                                            this.props.admin === Meteor.userId() && item._id !== Meteor.userId() ?
                                                <Icon icon="icon-cuowu" iconColor="#ef5350" onClick={() => this.handleDeleteMember(item._id)} />
                                                :
                                                null
                                        }

                                    </div>

                                    :
                                    null),
                            )
                        }
                        <Icon icon="icon-tianjia" size={32} onClick={this.handleAddMembers} iconColor="#ddd" />
                    </div>
                    <div className="group-members">
                        <p>消息免打扰</p>
                        <p><Switch defaultChecked={this.props.isDisturb} onChange={this.setNotDisturb} /></p>
                    </div>
                    <div className="group-members">
                        <p>群聊置顶</p>
                        <p><Switch defaultChecked={this.props.stickTop.value} onChange={this.setGroupFirst} /></p>
                    </div>
                    <div>
                        {
                            this.props.admin === Meteor.userId() ?
                                <div className="group-members">
                                    <p>群主设置</p>
                                    <button className="all" onClick={this.selectAdmin}>选择新群主</button>
                                </div>
                                :
                                null
                        }
                    </div>
                    <div className="btn-wrap">
                        {
                            this.props.admin === Meteor.userId() ?
                                <div>
                                    <button className="exit-group" onClick={this.exitGroupChat}>退出群聊</button>
                                    <button className="dissolve-group" onClick={this.deleteGroup}>解散群聊</button>
                                </div>
                                :
                                <button className="exit-group" onClick={this.exitGroupChat}>退出群聊</button>
                        }
                    </div>
                </div>
                <Modal
                    title="添加人员"
                    visible={this.state.isShowAddMembers}
                    onCancel={this.closeAddMembers}
                    width={430}
                    wrapClassName="create-team-mask"
                    footer={null}
                >
                    <SelectMembers
                        confirmSelected={this.addMembers}
                        team={this.props.team}
                    />
                </Modal>
                <Modal
                    title="管理员设置"
                    visible={this.state.isShowSeleteAdmin}
                    onCancel={this.closeSeleteAdmin}
                    width={430}
                    wrapClassName="create-team-mask"
                    footer={null}
                >
                    <SelectOne
                        teamMemberIds={this.state.teamMemberIds}
                        confirmChange={this.confirmChange}
                    />
                </Modal>
            </div>
        );
    }
}

export default withTracker(({ groupMemberIds, groupType, groupId }) => {
    Meteor.subscribe('company');
    Meteor.subscribe('users');
    Meteor.subscribe('user');
    const friendIds = UserUtil.getFriends();
    const groupMembers = groupMemberIds.map(_id =>
        Meteor.users.findOne({ _id }),
    );
    // 如果是团队群聊,只能添加团队内部人员
    if (groupType === 'team') {
        const teamGroup = Group.findOne({ _id: groupId });
        const currentCompanyId = teamGroup.companyId || teamGroup.superiorId;
        const currentCompany = Company.findOne(
            { _id: currentCompanyId },
            { fields: fields.searchCompany },
        );
        const comapanyMembers = currentCompany.members;
        const name = currentCompany.name;
        const memberIds = [];
        for (const value of Object.values(comapanyMembers)) {
            memberIds.push(value.userId);
        }
        const deps = currentCompany.deps || [];
        const department = deps.map((depId) => {
            const depMembers = comapanyMembers.filter(x => x.dep === depId.id);
            const depMemberIds = [];
            for (const value of Object.values(depMembers)) {
                depMemberIds.push(value.userId);
            }
            const restDepMembersIds = depMemberIds.filter(x => !groupMemberIds.find(y => y === x));
            return {
                name: depId.name,
                members: restDepMembersIds,
            };
        });
        const restMemberIds = memberIds.filter(x => !groupMemberIds.find(y => y === x));
        const team = [{
            name,
            members: restMemberIds,
            department,
        },
        ];
        return {
            team,
            groupMemberIds,
            groupMembers,
        };
    }
    const restFriendIds = friendIds.filter(x => !groupMemberIds.find(y => y === x));
    const friends = [
        {
            name: 'e建联好友',
            members: restFriendIds,
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
            const comapanyMembers = company.members;
            const name = company.name;
            const memberIds = [];
            for (const value of Object.values(comapanyMembers)) {
                memberIds.push(value.userId);
            }
            const deps = company.deps || [];
            const department = deps.map((depId) => {
                const depMembers = comapanyMembers.filter(x => x.dep === depId.id);
                const depMemberIds = [];
                for (const value of Object.values(depMembers)) {
                    depMemberIds.push(value.userId);
                }
                const restDepMembersIds = depMemberIds.filter(x => !groupMemberIds.find(y => y === x));
                return {
                    name: depId.name,
                    members: restDepMembersIds,
                };
            });
            /*
            1,不存在部门
            2,存在部门但是部门里面没有人
            */
            const restMemberIds = memberIds.filter(x => !groupMemberIds.find(y => y === x));
            return {
                name,
                members: restMemberIds,
                department,
            };
        });
        const team = friends.concat(teams);
        return {
            team,
            groupMemberIds,
            groupMembers,
        };
    }
    const team = friends;
    return {
        team,
        groupMemberIds,
        groupMembers,
    };
})(GroupSetting);

