import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import format from 'date-format';
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
        });
    }
    renderUser = (user, lastMessage, time, type, index) => (
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
                <p>{user.profile.name}<span className="message-createAt">{lastMessage ? formatDate.dealTime(lastMessage.createdAt) : format('hh:mm', time)} </span></p>
                <p className="last-message">
                    <span>{lastMessage ? (lastMessage.type === 'file' ? '[文件]' : lastMessage.content) : '可以开始聊天了' }</span>
                    {/* <span className="notice-red-dot">
                        200
                </span> */}
                </p>
            </div>
        </div>
    )
    renderGroup = (group, lastMessage, time, type, i) => (
        <div
            onClick={() => {
                this.props.changeTo(group._id, group._id);
            }}
            key={i}
            className={classnames('chat-user-pannel', { 'chat-user-pannel-avtive': this.props.selectedChat && this.props.selectedChat[group._id] })}
        >
            <Icon icon="icon-chuyidong" size={20} onClick={() => this.deleteChat(group._id, type)} />
            <div className="user-avatar">
                <Avatar avatar={group.avatar ? group.avatar : 'http://oxldjnom8.bkt.clouddn.com/team.jpeg'} name="群聊" />
            </div>
            <div className="user-message">
                <p>{group.name}<span className="message-createAt">{lastMessage ? formatDate.dealTime(lastMessage.createdAt) : format('hh:mm', time)} </span></p>
                <p className="last-message">
                    <span>{lastMessage ? (lastMessage.type === 'file' ? '[文件]' : lastMessage.content) : '可以开始聊天了'}</span>
                    {/* <span className="notice-red-dot">
                    200
            </span> */}
                </p>
            </div>
        </div>
    )
    renderChatListItem = (item, i) => {
        if (item.user) {
            return this.renderUser(item.user, item.lastMessage, item.time, item.type, i);
        } else if (item.group) {
            return this.renderGroup(item.group, item.lastMessage, item.time, item.type, i);
        }
        // console.error('不支持的聊天类型', item);
        return null;
    }
    render() {
        const chatList = this.props.chatList;
        const newChatList = chatList.sort(this.compare('time'));
        return (
            <div className="ejianlian-chat-message-list">
                {
                    newChatList.map((item, i) => this.renderChatListItem(item, i))
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
            const messages = Message.find({ to: IdUtil.merge(Meteor.userId(), x.userId) }).fetch();
            x.lastMessage = messages.length === 0 ? null : messages[messages.length - 1];
        } else if (x.type === 'group') {
            x.group = Group.findOne({ _id: x.groupId });
            const messages = Message.find({ to: x.groupId }).fetch();
            x.lastMessage = messages.length === 0 ? null : messages[messages.length - 1];
        }
    });
    return {
        chatList,
    };
})(ContactList);

