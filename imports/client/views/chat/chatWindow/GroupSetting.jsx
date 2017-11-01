import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { Switch } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Icon from '../../../components/Icon';
import Avatar from '../../../components/Avatar';
import AddGroup from '../chatSideLeft/addChat/AddGroup';
import SeleteAdmin from './SeleteAdmin';
import UserUtil from '../../../../util/user';
import feedback from '../../../../util/feedback';

@pureRender
class GroupSetting extends Component {
    static propTypes = {
        showGroupSet: PropTypes.func,
        groupName: PropTypes.string,
        members: PropTypes.array,
        users: PropTypes.array,
        groupId: PropTypes.string,
        admin: PropTypes.string,
    };
    constructor(...args) {
        super(...args);
        this.state = {
            isShowAddGroup: false,
            isShowSeleteAdmin: false,
            restUsers: [],
            restMembers: [],
        };
    }
    setNotDisturb = (checked) => {
        console.log('设置了消息免打扰', checked);
    }
    setGroupFirst = (checked) => {
        console.log('设置了当前群聊置顶', checked);
    }
    // 选择新的群主
    selectAdmin = () => {
        const { members } = this.props;
        const restMembers = members.filter(x => x._id !== Meteor.userId());
        this.setState({
            isShowSeleteAdmin: true,
            restMembers,
        });
    }
    closeSeleteAdmin = () => {
        this.setState({
            isShowSeleteAdmin: false,
        });
    }
    // 邀请更多好友
    handleAddGroup = () => {
        const { users = [], members } = this.props;
        const restUsers = users.filter(x => !members.find(y => y._id === x._id));
        this.setState({
            isShowAddGroup: !this.state.isShowAddGroup,
            restUsers,
        });
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
        Meteor.call('deleteGroup', this.props.groupId, (err) => {
            if (err) {
                console.error(err.reason);
            }
            feedback.dealSuccess('解散群聊成功');
            this.props.showGroupSet();
        });
    }
    // 移除群成员
    handleDeleteMember = (memberId) => {
        feedback.dealDelete('移出成员', '您确定移除该成员?', () => this.deleteMember(memberId, '移除成功'));
    }
    // 退出群聊
    exitGroupChat = () => {
        if (this.props.admin === Meteor.userId()) {
            feedback.dealWarning('您需要先转让群主，才可退出该群聊');
        } else {
            feedback.dealDelete('退出群聊', '您确定退出该群聊?', () => this.deleteMember(Meteor.userId(), '退出成功'));
        }
    }

    render() {
        return (
            <div className="container-wrap group-setting-block">
                <div className="opacity" onClick={this.props.showGroupSet} />
                <div className="container-middle container-content">
                    <div className="container-title">
                        群设置
                        <Icon icon="icon-guanbi icon-close" onClick={this.props.showGroupSet} size={20} />
                    </div>
                    <div className="group-info">
                        <div className="group-base-info">
                            <Avatar avatar="http://oxldjnom8.bkt.clouddn.com/team.jpeg" name="群聊" />
                            <p>{this.props.groupName}</p>
                        </div>
                        <button>编辑</button>
                    </div>
                    <div className="group-members">
                        <p>群成员{this.props.members.length}人</p>
                        <p className="all">全部成员</p>
                    </div>
                    <div className="members-avatar">
                        {
                            this.props.members.map((item, i) =>
                                (item.profile ?
                                    <div className="avatar-wrap" key={i}>
                                        <Avatar name={item.profile.name} avatarColor={item.profile.avatarColor} avatar={item.profile.avatar} />
                                        {
                                            this.props.admin === Meteor.userId() ?
                                                <Icon icon="icon-cuowu" iconColor="#ef5350" onClick={() => this.handleDeleteMember(item._id)} />
                                                :
                                                null
                                        }

                                    </div>

                                    :
                                    null),
                            )
                        }

                        <div className="avatar avatar-add" onClick={this.handleAddGroup}>+</div>
                    </div>
                    <div className="group-members">
                        <p>消息免打扰</p>
                        <p><Switch defaultChecked={false} onChange={this.setNotDisturb} /></p>
                    </div>
                    <div className="group-members">
                        <p>群聊置顶</p>
                        <p><Switch defaultChecked={false} onChange={this.setGroupFirst} /></p>
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
                <AddGroup
                    handleAddGroup={this.handleAddGroup}
                    isShowAddGroup={this.state.isShowAddGroup}
                    users={this.state.restUsers}
                    type="addMember"
                    groupId={this.props.groupId}
                    isEditGroupName={this.props.members.length < 4}
                    members={this.props.members}
                />
                {
                    this.state.isShowSeleteAdmin ?
                        <SeleteAdmin
                            users={this.state.restMembers}
                            groupId={this.props.groupId}
                            closeSeleteAdmin={this.closeSeleteAdmin}
                        />
                        :
                        null
                }
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('users');
    const friendIds = UserUtil.getFriends();
    const users = friendIds.map(_id => Meteor.users.findOne({ _id }));
    return {
        users,
    };
})(GroupSetting);

