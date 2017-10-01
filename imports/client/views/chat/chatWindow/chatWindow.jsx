import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import Messages from '../../../../../imports/schema/message';

import ChatFriendInfo from './chatFriendInfo';
import ChatFriendFile from './chatFriendFile';
import '../../../styles/view/chat/chatWindow/chatWindow.less';


@pureRender
class ChatWindow extends Component {
    static propTypes = {
        messages: PropTypes.arrayOf(PropTypes.object),
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isShowFriendInfo: false,
            isShowFriendFile: false,
        };
    }
    componentDidUpdate(prevProps) {
        if (prevProps.messages && this.props.messages && prevProps.messages.length !== this.props.messages.length) {
            const $lastMessage = this.messageList.children[this.messageList.children.length - 1];
            $lastMessage.scrollIntoView(true);
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
        Meteor.call('insertMessage', this.$message.value, Date.now(), (err) => {
            if (err) {
                return console.error(err.reason);
            }
            this.message.value = '';
        });
    }
    render() {
        return (
            <div className="ejianlian-chat-window">
                <div className="chat-to-user">
                    张三
                    <div className="chat-other-account">
                        <p><i className="icon" onClick={this.handleFriendFile}>&#xe672;</i></p>
                        <p><i className="icon" onClick={this.handleFriendInfo}>&#xe80d;</i></p>
                    </div>
                </div>
                <div className="chat-message-list" ref={i => this.messageList = i}>
                    {
                        this.props.messages.map((message, i) => (
                            <div className="message-list" key={i}>
                                <p className="user-avatar">
                                    <img src="http://wx.qlogo.cn/mmopen/An3cibgIYjcYeukMFYO9PdZCJbP5ftnShbibRKJ8RHX26qIV6FSJkribZCbTmv8Vlib8NVzvJCBtM2qMQBuzsdvDxUxcE7K8qTlV/0" alt="" />
                                </p>
                                <p className="user-message">
                                    {message.content}
                                </p>
                            </div>
                        ))
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
                            <i className="icon icon-card">&#xe652;</i>
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
                />
                <ChatFriendFile
                    style={{ display: this.state.isShowFriendFile ? 'block' : 'none' }}
                    handleFriendFile={this.handleFriendFile}
                />
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('messages');
    return {
        messages: Messages.find({}).fetch(),
    };
})(ChatWindow);
