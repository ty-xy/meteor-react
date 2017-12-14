import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import IdUtil from '../../../../util/id';
import Message from '../../../../schema/message';
import Group from '../../../../schema/group';
import Notice from '../../../../schema/notice';
import Avatar from '../../../components/Avatar';
import UserUtil from '../../../../util/user';
import Icon from '../../../components/Icon';
import feedback from '../../../../util/feedback';
import formatDate from '../../../../util/formatDate';
import PopulateUtil from '../../../../util/populate';
import NoticeSound from '../../../../util/sound';
import avatarUrl from '../../../../util/avatarUrl';

@pureRender
class ContactList extends Component {
    static propTypes = {
        changeTo: PropTypes.func.isRequired,
        chatList: PropTypes.array,
        handleToggle: PropTypes.func,
        selectedChat: PropTypes.object,
        allUnRead: PropTypes.array,
        handleNewFriend: PropTypes.func,
        newFriendNotice: PropTypes.array,
    }
    componentWillUpdate(nextProps) {
        if (nextProps.allUnRead && this.props.allUnRead < nextProps.allUnRead) {
            NoticeSound.play();
        }
    }
    compare = property => (a, b) => b[property] - a[property];
    deleteChat = (userId, type, unreadMessage) => {
        if (unreadMessage > 0) {
            Meteor.call('readMessages', this.props.allUnRead.map(x => x._id), Meteor.userId(), (err) => {
                if (err) {
                    return feedback.dealError(err);
                }
                Meteor.call('deleteChat', userId, type, (err2) => {
                    if (err2) {
                        return feedback.dealError(err2);
                    }
                    this.props.changeTo('', '');
                });
            });
        } else {
            Meteor.call('deleteChat', userId, type, (err2) => {
                if (err2) {
                    return feedback.dealError(err2);
                }
                this.props.changeTo('', '');
            });
        }
    }
    renderNewFriend = (notice, index, friendFrom) => (
        <div
            className={classnames('chat-user-pannel', { 'chat-user-pannel-avtive': this.props.selectedChat && this.props.selectedChat[notice._id] })}
            key={index}
            onClick={() => {
                this.props.handleToggle(notice._id);
                this.props.handleNewFriend('newFriend');
            }}
        >
            <div className="user-avatar new-friend-notice">
                <Icon icon="icon-icon15 icon" />
            </div>
            <div className="user-message">
                <p>新的好友<span className="message-createAt">{formatDate.renderDate(notice.createdAt)}</span></p>
                <p className="last-message">{friendFrom.profile && friendFrom.profile.name}请求添加好友
                    <span className="notice-red-dot">
                        {this.props.newFriendNotice.length}
                    </span>
                </p>
            </div>
        </div>
    )
    renderUser = (user, lastMessage, time, type, index, unreadMessage) => (
        <div
            key={index}
            onClick={() => {
                this.props.handleToggle(user._id);
                this.props.changeTo(IdUtil.merge(Meteor.userId(), user._id), user._id, '', 'message');
            }}
            className={classnames('chat-user-pannel', { 'chat-user-pannel-avtive': this.props.selectedChat && this.props.selectedChat[user._id] })}
        >
            <Icon icon="icon-guanbi" size={20} onClick={() => this.deleteChat(user._id, type, unreadMessage)} />
            <div className="user-avatar">
                <Avatar avatarColor={user.profile.avatarColor} name={user.profile.name} avatar={user.profile.avatar} />
            </div>
            <div className="user-message">
                <p>{user.profile.name}<span className="message-createAt">{lastMessage ? formatDate.renderDate(lastMessage.createdAt) : formatDate.renderDate(time)} </span></p>
                <p className="last-message">
                    <span className="last-content">{lastMessage ? (lastMessage.type === 'file' ? '[文件]' : lastMessage.content.replace(/<br\/>/g, ' ')) : '可以开始聊天了'}</span>
                    {
                        unreadMessage !== 0 ?
                            <span className="notice-red-dot">
                                {unreadMessage}
                            </span>
                            :
                            null

                    }

                </p>
            </div>
        </div>
    )
    renderGroup = (group, lastMessage, time, type, i, unreadMessage) => {
        const isMyDisturb = group.isDisturb && group.isDisturb.includes(Meteor.userId());
        return (<div
            onClick={() => {
                this.props.handleToggle(group._id);
                this.props.changeTo(group._id, group._id, '', 'message');
            }}
            key={i}
            className={classnames('chat-user-pannel', { 'chat-user-pannel-avtive': this.props.selectedChat && this.props.selectedChat[group._id] })}
        >
            {
                group.stickTop.value ?
                    <div className="triangle-topleft" />
                    :
                    null
            }
            <Icon icon="icon-guanbi" size={20} onClick={() => this.deleteChat(group._id, type, unreadMessage)} />
            <div className="user-avatar">
                <Avatar avatar={group.avatar ? group.avatar : avatarUrl.avatarGroup} name="群聊" />
            </div>
            <div className="user-message">
                <p>{group.name}<span className="message-createAt">{lastMessage ? formatDate.renderDate(lastMessage.createdAt) : formatDate.renderDate(time)} </span></p>
                <p className="last-message">
                    <span className="last-content">{lastMessage ? (lastMessage.type === 'file' ? '[文件]' : lastMessage.content.replace(/<br\/>/g, ' ')) : '可以开始聊天了'}</span>
                    {
                        unreadMessage !== 0 ?
                            <span className={isMyDisturb ? 'notice-red-dot-no notice-red-dot' : 'notice-red-dot'}>
                                {isMyDisturb ? '' : unreadMessage}
                            </span>
                            :
                            null

                    }
                    {
                        isMyDisturb ?
                            <Icon icon="icon-icon-yxj-no-disturbing" size={8} iconColor="#b2b2b2" />
                            :
                            null
                    }
                </p>
            </div>
        </div>
        );
    }
    renderChatListItem = (item, i) => {
        if (item.user) {
            if (item.unreadMessage > 0 && !this.props.chatList.find(j => j.user && j.user._id === item.user._id)) {
                Meteor.call('addChatList', item.user._id, 'userId', err => feedback.dealError(err));
            }
            return this.renderUser(item.user, item.lastMessage, item.time, item.type, i, item.unreadMessage);
        } else if (item.group) {
            return this.renderGroup(item.group, item.lastMessage, item.time, item.type, i, item.unreadMessage);
        } else if (item.notice) {
            return this.renderNewFriend(item.notice, i, item.friendFrom);
        }
        return null;
    }
    render() {
        const chatList = this.props.chatList;
        // 设置置顶的聊天列表
        const stickTopChat = chatList.filter(x => x.group && x.group.stickTop.value);
        stickTopChat.forEach((x) => {
            x.stickTime = x.group.stickTop.createdAt;
        });
        const newStickTopChat = stickTopChat.sort(this.compare('stickTime'));
        // 剩下没有设置置顶的聊天列表
        const defaultTopChat = chatList.filter(x => x.user || (x.group && !x.group.stickTop.value));
        // 找出最新的好友通知
        if (this.props.newFriendNotice.length > 0) {
            const lastNewFriendNotice = this.props.newFriendNotice.sort(this.compare('sortTime'))[0];
            defaultTopChat.push(lastNewFriendNotice);
        }
        const newDefaultTopChat = defaultTopChat.sort(this.compare('sortTime'));

        const sortedChatList = [...newStickTopChat, ...newDefaultTopChat];

        return (
            <div className="ejianlian-chat-message-list">
                {
                    sortedChatList.length > 0 ?
                        sortedChatList.map((item, i) => this.renderChatListItem(item, i))
                        :
                        <div className="no-content">暂无聊天列表</div>
                }
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('users');
    Meteor.subscribe('group');
    Meteor.subscribe('notice');
    const chatList = UserUtil.getChatList();

    const selfGroup = UserUtil.getGroups();
    const selfFriend = UserUtil.getFriends();
    const friendMessage = selfFriend.map(i => IdUtil.merge(Meteor.userId(), i));
    const chatMessageId = [...selfGroup, ...friendMessage];
    // 应该过滤出所有与我有关的消息
    const allMessage = Message.find({ to: { $in: chatMessageId } }).fetch();
    // console.log('所有的消息', allMessage);
    // 判断有未知消息的聊天是否存在用户的聊天列表中,如果没有,则创建
    let allUnRead = [];
    allUnRead = allMessage.filter(i => i.readedMembers && !i.readedMembers.includes(Meteor.userId()));
    // 点击删除的时候,将所有未读消息变为已读,但是allUnReload此时不会立刻更新数据,
    // 所以有未读消息时点击删除事此时这个消息列表已经删除,但是此时未读消息条数不会立刻更新,判断有未读消息,不存在该聊天窗口,则创建新的聊天窗口,过了一会数据更新了,未读消息为0
    // console.log(222, '有和你有关的未读消息', allUnRead.length);
    if (allUnRead.length > 0) {
        allUnRead.forEach((k) => {
            if (k.to.length <= 17) {
                // if (!chatList.find(j => j.group && j.group._id === k.to)) {
                Meteor.call('addChatList', k.to, 'groupId', (err) => {
                    feedback.dealError(err);
                });
                // }
                // 群聊天
            } else if (k.to.length >= 34) {
                const userId = k.to.slice(0, k.to.length / 2);
                if (userId !== Meteor.userId()) {
                    // 用户聊天
                    Meteor.call('addChatList', userId, 'userId', (err) => {
                        feedback.dealError(err);
                    });
                } else {
                    Meteor.call('addChatList', k.from._id, 'userId', (err) => {
                        feedback.dealError(err);
                    });
                }
            } else {
                console.log('to字段Id的长度', k.to.length);
            }
        });
    }
    // 已存在聊天列表中显示未读消息
    chatList.forEach((x) => {
        if (x.type === 'user') {
            x.user = Meteor.users.findOne({ _id: x.userId });
            const messages = Message.find({ to: IdUtil.merge(Meteor.userId(), x.userId) }, { sort: { createdAt: -1 } }).fetch();
            x.lastMessage = messages.length === 0 ? null : messages[0];
            x.sortTime = x.lastMessage ? x.lastMessage.createdAt : x.time;
            x.unreadMessage = messages.filter(i => i.readedMembers && !i.readedMembers.includes(Meteor.userId())).length;
        } else if (x.type === 'group') {
            x.group = Group.findOne({ _id: x.groupId });
            const messages = Message.find({ to: x.groupId }, { sort: { createdAt: -1 } }).fetch();
            x.lastMessage = messages.length === 0 ? null : messages[0];
            x.sortTime = x.lastMessage ? x.lastMessage.createdAt : x.time;
            x.unreadMessage = messages.filter(i => i.readedMembers && !i.readedMembers.includes(Meteor.userId())).length;
        }
    });
    // 找出别人向你发起的未处理的好友认证
    const newFriendNotice = Notice.find({ type: 0, to: Meteor.userId(), dealResult: 0 }).fetch();
    newFriendNotice.forEach((x) => {
        x.notice = Notice.findOne({ _id: x._id });
        x.friendFrom = PopulateUtil.user(x.notice && x.notice.from) || {};
        x.sortTime = x.createdAt;
    });
    // console.log('别人向你发的好友认证', newFriendNotice);
    return {
        chatList,
        allUnRead,
        newFriendNotice,
    };
})(ContactList);

