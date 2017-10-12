import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import Message from '../../../../../imports/schema/message';

import ChatFriendInfo from './ChatFriendInfo';
import ChatFriendFile from './ChatFriendFile';
import AvatarSelf from '../../../components/AvatarSelf';
import Avatar from '../../../components/Avatar';


@pureRender
class ChatWindow extends Component {
    static propTypes = {
        messages: PropTypes.arrayOf(PropTypes.object),
        to: PropTypes.string.isRequired,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isShowFriendInfo: false,
            isShowFriendFile: false,
            name: '哈哈',
            avatarColor: '#f58f47',
            username: '15733258134',
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
        return (
            <div className="ejianlian-chat-window">
                <div className="chat-to-user">
                    {this.props.to}
                    <div className="chat-other-account">
                        <p><i className="icon" onClick={this.handleFriendFile}>&#xe672;</i></p>
                        <p><i className="icon" onClick={this.handleFriendInfo}>&#xe80d;</i></p>
                    </div>
                </div>
                <div className="chat-message-list" ref={i => this.messageList = i}>
                    {
                        this.props.messages.map((message, i) => {
                            console.log(message.content, message.from === Meteor.userId() ? '我应该在右边' : '我应该在左边');
                            return (
                                <div className={message.from === Meteor.userId() ? 'self-message' : 'message'} key={i}>
                                    <p className="user-avatar">
                                        {message.from === Meteor.userId()
                                            ? <AvatarSelf />
                                            : <Avatar name="大傻子" avatarColor="#8b91e8" />
                                        }

                                    </p>
                                    <p className="user-message">
                                        {message.content}
                                    </p>
                                </div>
                            );
                        })
                    }
                </div>
                <div className="chat-window-bottom">
                    <div className="chat-send-skill">
                        <p className="skill-icon">
                            <i className="icon">&#xe61b;</i>
                        </p>
                        <p className="skill-icon">
                            <i className="icon">&#xe672;</i>
                        </p>
                        <p className="skill-icon">
                            <i className="icon icon-card" />
                        </p>
                        <p className="skill-icon">
                            <i className="icon">&#xe66c;</i>
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
                    name={this.state.name}
                    avatarColor={this.state.avatarColor}
                    username={this.state.username}
                />
                <ChatFriendFile
                    style={{ display: this.state.isShowFriendFile ? 'block' : 'none' }}
                    handleFriendFile={this.handleFriendFile}
                />
            </div>
        );
    }
}

export default withTracker(({ to }) => {
    Meteor.subscribe('message');
    return {
        messages: Message.find({ to }).fetch(),
        to,
    };
})(ChatWindow);

