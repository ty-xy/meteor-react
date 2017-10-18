import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import format from 'date-format';

import IdUtil from '../../../../util/id';
import Message from '../../../../schema/message';
import Group from '../../../../schema/group';
import Avatar from '../../../components/Avatar';
import UserUtil from '../../../../util/user';
import Icon from '../../../components/Icon';

@pureRender
class ContactList extends Component {
    static propTypes = {
        changeTo: PropTypes.func.isRequired,
        chatList: PropTypes.array,
    }

    render() {
        return (
            <div className="ejianlian-chat-message-list">
                <div className="chat-user-pannel">
                    <div className="user-avatar work-notice">
                        <Icon icon="icon-tongzhi1 icon" />
                    </div>
                    <div className="user-message">
                        <p>工作通知<span className="message-createAt">12:00</span></p>
                        <p className="last-message">这是最后一条消息
                            <span className="notice-red-dot notice-red-zexo">
                                0
                            </span>
                        </p>
                    </div>
                </div>
                <div className="chat-user-pannel ">
                    <div className="user-avatar project-notice">
                        <Icon icon="icon-xiangmu icon" />
                    </div>
                    <div className="user-message">
                        <p>项目通知<span className="message-createAt">12:00</span></p>
                        <p className="last-message">这是最后一条消息
                            <span className="notice-red-dot">
                                2
                            </span>
                        </p>
                    </div>
                </div>
                <div className="chat-user-pannel" onClick={() => this.props.changeTo('群聊222')}>
                    <div className="user-avatar">
                        <img src="http://wx.qlogo.cn/mmopen/An3cibgIYjcYeukMFYO9PdZCJbP5ftnShbibRKJ8RHX26qIV6FSJkribZCbTmv8Vlib8NVzvJCBtM2qMQBuzsdvDxUxcE7K8qTlV/0" alt="" />
                    </div>
                    <div className="user-message">
                        <p>群聊222<span className="message-createAt">12:00</span></p>
                        <p className="last-message">
                            <span>The Weather is good!</span>
                            <span className="notice-red-dot">
                                200
                            </span>
                        </p>
                    </div>
                </div>
                <div className="chat-user-pannel ">
                    <div className="user-avatar new-friend-notice">
                        <Icon icon="icon-icon15 icon" />
                    </div>
                    <div className="user-message">
                        <p>新的好友<span className="message-createAt">12:00</span></p>
                        <p className="last-message">许林伟请求添加好友
                            <span className="notice-red-dot">
                                1
                            </span>
                        </p>
                    </div>
                </div>
                {
                    this.props.chatList.map((item, i) => (
                        item.user ?
                            <div className="chat-user-pannel" onClick={() => this.props.changeTo(IdUtil.merge(Meteor.userId(), item.userId), item.userId)} key={i}>
                                <div className="user-avatar">
                                    <Avatar avatarColor={item.user.profile.avatarColor} name={item.user.profile.name} avatar={item.user.profile.avatar} />
                                </div>
                                <div className="user-message">
                                    <p>{item.user.profile.name}<span className="message-createAt">{item.lastMessage ? format('hh:mm', new Date(item.lastMessage.createdAt)) : format('hh:mm', new Date(new Date()))} </span></p>
                                    <p className="last-message">
                                        <span>{item.lastMessage ? item.lastMessage.content : '可以开始聊天了'}</span>
                                        {/* <span className="notice-red-dot">
                                            200
                                    </span> */}
                                    </p>
                                </div>
                            </div>
                            :
                            item.group ?
                                <div className="chat-user-pannel" onClick={() => this.props.changeTo(item.groupId, item.groupId)} key={i}>
                                    <div className="user-avatar">
                                        <Avatar avatar={item.group.avatar ? item.group.avatar : 'http://oxldjnom8.bkt.clouddn.com/team.jpeg'} name="群聊" />
                                    </div>
                                    <div className="user-message">
                                        <p>{item.group.name}<span className="message-createAt">{item.lastMessage ? format('hh:mm', new Date(item.lastMessage.createdAt)) : format('hh:mm', new Date(new Date()))} </span></p>
                                        <p className="last-message">
                                            <span>{item.lastMessage ? item.lastMessage.content : '可以开始聊天了'}</span>
                                            {/* <span className="notice-red-dot">
                                            200
                                    </span> */}
                                        </p>
                                    </div>
                                </div>
                                :
                                null
                    ))
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
    console.log(chatList);
    return {
        chatList,
    };
})(ContactList);

