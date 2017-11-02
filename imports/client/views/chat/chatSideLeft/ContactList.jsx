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

@pureRender
class ContactList extends Component {
    static propTypes = {
        changeTo: PropTypes.func.isRequired,
        chatList: PropTypes.array,
        handleToggle: PropTypes.func,
        selectedChat: PropTypes.object,
    }
    compare = property => (a, b) => b[property] - a[property];
    deleteChat = (userId, type) => {
        Meteor.call('deleteChat', userId, type, (err) => {
            feedback.dealError(err);
            this.props.changeTo('', '');
        });
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
            <Icon icon="icon-chuyidong" size={20} onClick={() => this.deleteChat(user._id, type)} />
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
            <Icon icon="icon-chuyidong" size={20} onClick={() => this.deleteChat(group._id, type)} />
            <div className="user-avatar">
                <Avatar avatar={group.avatar ? group.avatar : 'http://oxldjnom8.bkt.clouddn.com/team.jpeg'} name="群聊" />
            </div>
            <div className="user-message">
                <p>{group.name}<span className="message-createAt">{lastMessage ? formatDate.renderDate(lastMessage.createdAt) : formatDate.renderDate(time)} </span></p>
                <p className="last-message">
                    <span className="last-content">{lastMessage ? (lastMessage.type === 'file' ? '[文件]' : lastMessage.content) : '可以开始聊天了'}</span>
                    {
                        unreadMessage !== 0 ?
                            <span className="notice-red-dot">
                                {unreadMessage}
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
    };
})(ContactList);

