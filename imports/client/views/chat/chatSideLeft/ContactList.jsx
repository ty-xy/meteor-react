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
        history: PropTypes.object,
        handleToggle: PropTypes.func,
        selectedChat: PropTypes.object,
        allUnRead: PropTypes.array,
        location: PropTypes.object,
        newFriendNotice: PropTypes.array,
    }
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillMount() {
        // Meteor.call(
        //     'getContactListNum',
        //     { chatList: UserUtil.getChatList() },
        //     (res, err) => {
        //         console.log('componentWillMount', res, err, this.props, UserUtil.getChatList());
        //     },
        // );
    }
    componentWillUpdate(nextProps) {
        if (nextProps.allUnRead && this.props.allUnRead < nextProps.allUnRead) {
            NoticeSound.play();
        }
    }
    handleChatNewfriend = () => {
        this.props.history.push({ pathname: '/chat/newfriend' });
    }
    handleChatWindow = (id, type) => {
        this.props.history.push({ pathname: `/chat/${id}/window`, state: { type } });
        console.log(type);
    }
    compare = property => (a, b) => b[property] - a[property];
    deleteChat = (userId, type, unreadMessage, e) => {
        console.log(type, userId);
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
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
                this.handleChatNewfriend();
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
    renderUser = (user, lastMessage, time, type, index, unreadMessage, id) => {
        const arr = this.props.location.pathname.split('/');
        return (
            <div
                key={index}
                onClick={() => {
                    this.props.handleToggle(id);
                    // this.props.changeTo(IdUtil.merge(Meteor.userId(), user._id), user._id, '', 'message');
                    this.handleChatWindow(id, type);
                }}
                className={classnames('chat-user-pannel', { 'chat-user-pannel-avtive': arr.indexOf(id) > 0 })}
            >
                <div className="icon-guanbi-close">
                    <Icon icon="icon-guanbi" size={20} onClick={e => this.deleteChat(id, type, unreadMessage, e)} />
                </div>
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
        );
    }
    renderGroup = (_id, isDisturb, avatar, name, stickTop, lastMessage, time, type, i, unreadMessage) => {
        const isMyDisturb = isDisturb.includes(Meteor.userId());
        const selfStickTop = stickTop.find(x => x.userId && x.userId === Meteor.userId());
        const arr = this.props.location.pathname.split('/');
        return (<div
            onClick={() => {
                this.props.handleToggle(_id);
                this.handleChatWindow(_id, type);
            }}
            key={i}
            className={classnames('chat-user-pannel', { 'chat-user-pannel-avtive': arr.indexOf(_id) > 0 })}
        >
            {
                selfStickTop && selfStickTop.userId === Meteor.userId() ?
                    <div className="triangle-topleft" />
                    :
                    null
            }
            <div className="icon-guanbi-close">
                <Icon icon="icon-guanbi" size={20} onClick={e => this.deleteChat(_id, type, unreadMessage, e)} />
            </div>
            <div className="user-avatar">
                <Avatar avatar={avatar || avatarUrl.avatarGroup} name="群聊" />
            </div>
            <div className="user-message">
                <p>{name}<span className="message-createAt">{lastMessage ? formatDate.renderDate(lastMessage.createdAt) : formatDate.renderDate(time)} </span></p>
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
        if (item.type === 'user') {
            const mem = item.members ? item.members.filter(value => value !== Meteor.userId()) : '';
            const users = Meteor.users.findOne({ _id: mem[0] });
            return this.renderUser(users, item.lastMessage, item.time, item.type, i, item.unreadMessage, item._id, mem);
        } else if (item.type === 'team' || item.type === 'group') {
            return this.renderGroup(item._id, item.isDisturb || [], item.avatar, item.name, item.stickTop || [], item.lastMessage, item.time, item.type, i, item.unreadMessage);
        } else if (item.notice) {
            return this.renderNewFriend(item.notice, i, item.friendFrom);
        }
        return null;
    }
    render() {
        const chatList = this.props.chatList;
        // 设置置顶的聊天列表
        const stickTopChat = chatList.filter(x => x.group && x.group.stickTop.find(s => s.userId && s.userId === Meteor.userId()));
        stickTopChat.forEach((x) => {
            x.stickTime = x.group.stickTop[0].createdAt;
        });
        const newStickTopChat = stickTopChat.sort(this.compare('stickTime'));
        // 剩下没有设置置顶的聊天列表
        const defaultTopChat = chatList.filter(x => x.user || (x.group && !x.group.stickTop.find(s => s.userId && s.userId === Meteor.userId())));
        // 找出最新的好友通知
        if (this.props.newFriendNotice.length > 0) {
            const lastNewFriendNotice = this.props.newFriendNotice.sort(this.compare('sortTime'))[0];
            defaultTopChat.push(lastNewFriendNotice);
            Object.assign(chatList, this.props.newFriendNotice);
        }
        const newDefaultTopChat = defaultTopChat.sort(this.compare('sortTime'));
        const sortedChatList = [...newStickTopChat, ...newDefaultTopChat];
        console.log('sortedChatList', sortedChatList, newStickTopChat, newDefaultTopChat, chatList);
        const newArr = [];
        const spliceNum = [];
        chatList.forEach((item, index) => {
            if (newArr.indexOf(item.groupId) < 0) {
                newArr.push(item.groupId);
            } else {
                spliceNum.push(index);
            }
        });
        let res = [];
        if (spliceNum.length) {
            spliceNum.forEach((i, index) => {
                if (index === 0) {
                    res = res.concat(chatList.splice(0, i));
                } else {
                    res = res.concat(chatList.splice(i, chatList[index + 1] - 1 || 0));
                }
            });
        } else {
            res = chatList;
        }

        console.log('newArr1', spliceNum, newArr, spliceNum, res);
        return (
            <div className="ejianlian-chat-message-list">
                {
                    res.length > 0 ?
                    res.map((item, i) => this.renderChatListItem(item, i))
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
    chatList.forEach((item, index) => {
        Object.assign(item, Group.findOne({ _id: item.groupId }));
        const allNum = Message.find({ 'to.userId': Meteor.userId(), groupId: item.groupId }).fetch() || [];
        const isReadNum = Message.find({ to: { userId: Meteor.userId(), isRead: true }, groupId: chatList[index].groupId }).fetch() || [];
        item.unreadMessage = (allNum.length - isReadNum.length) || 0;
        item.lastMessage = allNum.createdAt;
    });
    const selfGroup = UserUtil.getGroups();

    const selfFriend = UserUtil.getFriends();
    console.log(selfGroup, selfFriend);
    const friendMessage = selfFriend.map(i => IdUtil.merge(Meteor.userId(), i));
    const chatMessageId = [...selfGroup, ...friendMessage];
    console.log(chatMessageId);
    // 应该过滤出所有与我有关的消息
    const allMessage = Message.find({ to: { $in: chatMessageId } }).fetch();
    // 判断有未知消息的聊天是否存在用户的聊天列表中,如果没有,则创建
    console.log(allMessage);
    let allUnRead = [];
    allUnRead = allMessage.filter(i => i.readedMembers && !i.readedMembers.includes(Meteor.userId()));
    console.log(allUnRead.length);
    // 所以有未读消息时点击删除事此时这个消息列表已经删除,但是此时未读消息条数不会立刻更新,判断有未读消息,不存在该聊天窗口,则创建新的聊天窗口,过了一会数据更新了,未读消息为0
    if (allUnRead.length > 0) {
        allUnRead.forEach((k) => {
            console.log(k.to.length);
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
    // 找出别人向你发起的未处理的好友认证
    const newFriendNotice = Notice.find({ type: 0, to: Meteor.userId(), dealResult: 0 }).fetch();
    newFriendNotice.forEach((x) => {
        x.notice = Notice.findOne({ _id: x._id });
        x.friendFrom = PopulateUtil.user(x.notice && x.notice.from) || {};
        x.sortTime = x.createdAt;
    });
    return {
        chatList,
        allUnRead,
        newFriendNotice,
    };
})(ContactList);

