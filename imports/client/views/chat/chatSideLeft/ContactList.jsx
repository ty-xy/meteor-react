import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import IdUtil from '../../../../util/id';
import Message from '../../../../schema/message';
import Group from '../../../../schema/group';
import Avatar from '../../../components/Avatar';
import UserUtil from '../../../../util/user';
import Icon from '../../../components/Icon';
import feedback from '../../../../util/feedback';
import formatDate from '../../../../util/formatDate';
import NoticeSound from '../../../components/NoticeSound';

let lastLength = 0;
@pureRender
class ContactList extends Component {
    static propTypes = {
        changeTo: PropTypes.func.isRequired,
        chatList: PropTypes.array,
        handleToggle: PropTypes.func,
        selectedChat: PropTypes.object,
        allUnRead: PropTypes.array,
    }
    // constructor(...args) {
    //     super(...args);
    //     this.state = {
    //         isPlay: false,
    //     };
    // }
    compare = property => (a, b) => b[property] - a[property];
    deleteChat = (userId, type, unreadMessage) => {
        Meteor.call('deleteChat', userId, type, (err) => {
            feedback.dealError(err);
            this.props.changeTo('', '');
        });
        if (unreadMessage > 0) {
            this.props.allUnRead.forEach((x) => {
                Meteor.call('readMessage', x._id, Meteor.userId(), (err) => {
                    console.log(err);
                });
            });
        }
    }

    renderSound = (unreadMessage) => {
        // console.log(unreadMessage, lastLength);
        if (unreadMessage > lastLength) {
            lastLength = unreadMessage;
            return true;
        }
        return false;
    }
    renderUser = (user, lastMessage, time, type, index, unreadMessage) => (
        <div
            key={index}
            onClick={() => {
                this.props.handleToggle(user._id);
                this.props.changeTo(IdUtil.merge(Meteor.userId(), user._id), user._id);
            }}
            className={classnames('chat-user-pannel', { 'chat-user-pannel-avtive': this.props.selectedChat && this.props.selectedChat[user._id] })}
        >
            <NoticeSound isPlay={this.renderSound(unreadMessage)} />
            <Icon icon="icon-chuyidong" size={20} onClick={() => this.deleteChat(user._id, type, unreadMessage)} />
            <div className="user-avatar">
                <Avatar avatarColor={user.profile.avatarColor} name={user.profile.name} avatar={user.profile.avatar} />
            </div>
            <div className="user-message">
                <p>{user.profile.name}<span className="message-createAt">{lastMessage ? formatDate.renderDate(lastMessage.createdAt) : formatDate.renderDate(time)} </span></p>
                <p className="last-message">
                    <span>{lastMessage ? (lastMessage.type === 'file' ? '[文件]' : lastMessage.content) : '可以开始聊天了'}</span>
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
    renderGroup = (group, lastMessage, time, type, i, unreadMessage) => (
        <div
            onClick={() => {
                this.props.changeTo(group._id, group._id);
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
            <NoticeSound isPlay={this.renderSound(unreadMessage)} />
            <Icon icon="icon-chuyidong" size={20} onClick={() => this.deleteChat(group._id, type, unreadMessage)} />
            <div className="user-avatar">
                <Avatar avatar={group.avatar ? group.avatar : 'http://oxldjnom8.bkt.clouddn.com/groupAvatar.png'} name="群聊" />
            </div>
            <div className="user-message">
                <p>{group.name}<span className="message-createAt">{lastMessage ? formatDate.renderDate(lastMessage.createdAt) : formatDate.renderDate(time)} </span></p>
                <p className="last-message">
                    <span className="last-content">{lastMessage ? (lastMessage.type === 'file' ? '[文件]' : lastMessage.content) : '可以开始聊天了'}</span>
                    {
                        unreadMessage !== 0 ?
                            <span className={group.isDisturb ? 'notice-red-dot-no notice-red-dot' : 'notice-red-dot'}>
                                {group.isDisturb ? '' : unreadMessage}
                            </span>
                            :
                            null

                    }
                    <span>{group.isDisturb}</span>
                    {
                        group.isDisturb ?
                            <Icon icon="icon-icon-yxj-no-disturbing" size={8} iconColor="#b2b2b2" />
                            :
                            null
                    }
                </p>
            </div>
        </div>
    )
    renderChatListItem = (item, i) => {
        if (item.user) {
            if (item.unreadMessage > 0 && !this.props.chatList.find(j => j.user && j.user._id === item.user._id)) {
                Meteor.call('addChatList', item.user._id, 'userId', (err) => {
                    console.log(err);
                });
            }
            return this.renderUser(item.user, item.lastMessage, item.time, item.type, i, item.unreadMessage);
        } else if (item.group) {
            return this.renderGroup(item.group, item.lastMessage, item.time, item.type, i, item.unreadMessage);
        }
        // console.error('不支持的聊天类型', item);
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
        const newDefaultTopChat = defaultTopChat.sort(this.compare('sortTime'));

        const sortedChatList = newStickTopChat.concat(newDefaultTopChat);

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
    const chatList = UserUtil.getChatList();
    // 判断有未知消息的聊天是否存在用户的聊天列表中,如果没有,则创建
    const allMessage = Message.find({}).fetch();
    const allUnRead = allMessage.filter(i => i.readedMembers && !i.readedMembers.includes(Meteor.userId()));
    if (allUnRead.length > 0) {
        allUnRead.forEach((k) => {
            if (k.to.length <= 17) {
                // if (!chatList.find(j => j.group && j.group._id === k.to)) {
                Meteor.call('addChatList', k.to, 'groupId', (err) => {
                    console.log(err);
                });
                // }
                // 群聊天
            } else if (k.to.length >= 34) {
                const userId = k.to.slice(0, k.to.length / 2);
                if (userId !== Meteor.userId()) {
                    // 用户聊天
                    Meteor.call('addChatList', userId, 'userId', (err) => {
                        console.log(err);
                    });
                } else {
                    Meteor.call('addChatList', k.from._id, 'userId', (err) => {
                        console.log(err);
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
    return {
        chatList,
        allUnRead,
    };
})(ContactList);

