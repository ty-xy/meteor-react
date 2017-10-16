import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import format from 'date-format';

import IdUtil from '../../../../util/id';
import Message from '../../../../schema/message';
import Avatar from '../../../components/Avatar';

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
                        <i className="icon">&#xe61e;</i>
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
                        <i className="icon">&#xe600;</i>
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
                {
                    this.props.chatList.map((item, i) => (
                        <div className="chat-user-pannel" onClick={() => this.props.changeTo(IdUtil.merge(Meteor.userId(), item.userId))} key={i}>
                            <div className="user-avatar">
                                <Avatar avatarColor={item.user ? item.user.profile.avatarColor : ''} name={item.user ? item.user.profile.name : ''} />
                            </div>
                            <div className="user-message">
                                <p>{item.user ? item.user.profile.name : ''}<span className="message-createAt">{item.lastMessage ? format('hh:mm', new Date(item.lastMessage.createdAt)) : ''} </span></p>
                                <p className="last-message">
                                    <span>{item.lastMessage ? item.lastMessage.content : ''}</span>
                                    {/* <span className="notice-red-dot">
                                            200
                                    </span> */}
                                </p>
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('users');
    const { profile = {} } = Meteor.user() || {};
    const { chatList = [] } = profile;
    chatList.forEach((x) => {
        if (x.type === 'user') {
            x.user = Meteor.users.findOne({ _id: x.userId });
            const messages = Message.find({ to: IdUtil.merge(Meteor.userId(), x.userId) }).fetch();
            x.lastMessage = messages.length === 0 ? null : messages[messages.length - 1];
            console.log(3333, x);
        }
    });
    return {
        chatList,
    };
})(ContactList);

