import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { Switch } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Icon from '../../../components/Icon';
import Avatar from '../../../components/Avatar';
import AddGroup from '../chatSideLeft/addChat/AddGroup';
import UserUtil from '../../../../util/user';

@pureRender
class GroupSetting extends Component {
    static propTypes = {
        showGroupSet: PropTypes.func,
        groupName: PropTypes.string,
        members: PropTypes.array,
        users: PropTypes.array,
        groupId: PropTypes.string,
    };
    constructor(...args) {
        super(...args);
        this.state = {
            isShowAddGroup: false,
            restUsers: [],
        };
    }
    handleAddGroup = () => {
        const { users = [], members } = this.props;
        const restUsers = users.filter(x => !members.find(y => y._id === x._id));
        this.setState({
            isShowAddGroup: !this.state.isShowAddGroup,
            restUsers,
        });
    }
    render() {
        return (
            <div className="container-wrap group-setting-block">
                <div className="container-middle container-content">
                    <div className="container-title">
                        群设置
                        <Icon icon="icon-guanbi icon icon-close-codeBlock icon-close" onClick={this.props.showGroupSet} />
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
                                    <Avatar key={i} name={item.profile.name} avatarColor={item.profile.avatarColor} avatar={item.profile.avatar} />
                                    :
                                    null),
                            )
                        }

                        <div className="avatar avatar-add" onClick={this.handleAddGroup}>+</div>
                    </div>
                    <div className="group-members">
                        <p>消息免打扰</p>
                        <p><Switch defaultChecked={false} /></p>
                    </div>
                    <div className="group-members">
                        <p>群聊置顶</p>
                        <p><Switch defaultChecked={false} /></p>
                    </div>
                    <div className="group-members">
                        <p>群主设置</p>
                        <p className="all">选择新群主</p>
                    </div>
                    <div className="btn-wrap">
                        <button className="exit-group">退出群聊</button>
                        <button className="dissolve-group">解散群聊</button>
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

