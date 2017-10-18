import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import Message from '../../../../../imports/schema/message';
import Group from '../../../../../imports/schema/group';

import ChatFriendInfo from './ChatFriendInfo';
import ChatFriendFile from './ChatFriendFile';
import Avatar from '../../../components/Avatar';
import Icon from '../../../components/Icon';


@pureRender
class ChatWindow extends Component {
    static propTypes = {
        messages: PropTypes.arrayOf(PropTypes.object),
        to: PropTypes.string,
        chatUser: PropTypes.object,
        chatGroup: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isShowFriendInfo: false,
            isShowFriendFile: false,
        };
    }
    componentDidMount() {
        this.$message.addEventListener('keydown', this.handleSendMessage);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.messages && this.props.messages && prevProps.messages.length !== this.props.messages.length) {
            const $lastMessage = this.messageList.children[this.messageList.children.length - 1];
            if ($lastMessage) {
                $lastMessage.scrollIntoView(true);
            }
        }
    }
    handleFriendInfo = () => {
        this.setState({
            isShowFriendInfo: !this.state.isShowFriendInfo,
        });
    }
    handleFriendFile = () => {
        console.log(222222);
        this.setState({
            isShowFriendFile: !this.state.isShowFriendFile,
        });
    }
    sendMessage = () => {
        Meteor.call(
            'insertMessage',
            {
                content: this.$message.value,
                createdAt: new Date(),
                to: this.props.to,
            },
            (err) => {
                if (err) {
                    return console.error(err.reason);
                }
                this.$message.value = '';
            });
    }
    handleSendMessage = (e) => {
        if (e.keyCode === 13) {
            this.sendMessage();
        }
    }
    render() {
        const { profile = {}, username = '' } = this.props.chatUser || {};
        const { name = '', avatarColor = '', avatar = '' } = profile;
        const groupName = this.props.chatGroup ? this.props.chatGroup.name : '';
        const groupId = this.props.chatGroup ? this.props.chatGroup._id : '';
        return (
            <div className="ejianlian-chat-window">
                {
                    name ?
                        <div className="chat-to-user">
                            {name}
                            <div className="chat-other-account">
                                <p>
                                    <Icon icon="icon-wenjian icon" onClick={this.handleFriendFile} />
                                </p>
                                <p>
                                    <Icon icon="icon-gerenziliao icon" onClick={this.handleFriendInfo} />
                                </p>
                            </div>
                        </div>
                        :
                        <div className="chat-to-user">
                            {groupName}
                            <div className="chat-other-account">
                                <p>
                                    <Icon icon="icon-tongzhi2 icon" />
                                </p>
                                <p>
                                    <Icon icon="icon-wenjian icon" />
                                </p>
                                <p>
                                    <Icon icon="icon-shezhi icon" />
                                </p>
                            </div>
                        </div>
                }
                <div className="chat-message-list" ref={i => this.messageList = i}>
                    {
                        this.props.messages.map((message, i) => {
                            console.log(message.content, message.from._id === Meteor.userId() ? '我应该在右边' : '我应该在左边');
                            return (
                                <div className={message.from._id === Meteor.userId() ? 'self-message' : 'message'} key={i}>
                                    <p className="user-avatar">
                                        <Avatar name={message.from.profile.name} avatarColor={message.from.profile.avatarColor} avatar={message.from.profile.avatar} />
                                    </p>
                                    <div className="user-message-wrap">
                                        {
                                            message.to === groupId ?
                                                <p className="user-nickname">{message.from.profile.name}</p>
                                                :
                                                null
                                        }
                                        <p className="user-message">{message.content}</p>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <div className="chat-window-bottom">
                    <div className="chat-send-skill">
                        <p className="skill-icon">
                            <Icon icon="icon-biaoqing icon" />
                        </p>
                        <p className="skill-icon">
                            <Icon icon="icon-wenjian icon" />
                        </p>
                        <p className="skill-icon">
                            <Icon icon="icon-card icon" />
                        </p>
                        <p className="skill-icon">
                            <Icon icon="icon-dingwei icon" />
                        </p>
                    </div>
                    <div className="chat-message-input">
                        <textarea name="" id="" cols="30" rows="10" ref={i => this.$message = i} />
                        <p className="chat-send-message" onClick={this.sendMessage}>发送</p>
                    </div>
                </div>
                <ChatFriendInfo
                    style={{ display: this.state.isShowFriendInfo ? 'block' : 'none' }}
                    handleFriendInfo={this.handleFriendInfo}
                    name={name}
                    avatarColor={avatarColor}
                    username={username}
                    avatar={avatar}
                />
                <ChatFriendFile
                    style={{ display: this.state.isShowFriendFile ? 'block' : 'none' }}
                    handleFriendFile={this.handleFriendFile}
                />
            </div>
        );
    }
}

export default withTracker(({ to, userId }) => {
    Meteor.subscribe('message');
    Meteor.subscribe('group');
    console.log(Group.find({}).fetch());
    const chatGroup = Group.findOne({ _id: to });
    if (chatGroup && chatGroup.members) {
        chatGroup.members.forEach((x) => {
            x.user = Meteor.users.findOne({ _id: x });
        });
    }
    return {
        messages: Message.find({ to }).fetch(),
        to,
        chatUser: Meteor.users.findOne({ _id: userId }),
        chatGroup,
    };
})(ChatWindow);

