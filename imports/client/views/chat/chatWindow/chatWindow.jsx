import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

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
        Meteor.call('insertMessage', this.message.value, Date.now(), (err, result) => {
            console.log('发送消息', result);
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
                <div className="chat-time">23:00</div>
                <div className="chat-message-wrap">
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
                    {/* <div className="message-list">
                        <p className="user-avatar">
                            <img src="http://wx.qlogo.cn/mmopen/An3cibgIYjcYeukMFYO9PdZCJbP5ftnShbibRKJ8RHX26qIV6FSJkribZCbTmv8Vlib8NVzvJCBtM2qMQBuzsdvDxUxcE7K8qTlV/0" alt="" />
                        </p>
                        <p className="user-message">
                            早上好
                        </p>
                    </div>
                    <div className="message-list">
                        <p className="user-avatar">
                            <img src="http://wx.qlogo.cn/mmopen/An3cibgIYjcYeukMFYO9PdZCJbP5ftnShbibRKJ8RHX26qIV6FSJkribZCbTmv8Vlib8NVzvJCBtM2qMQBuzsdvDxUxcE7K8qTlV/0" alt="" />
                        </p>
                        <p className="user-message">早上好</p>
                    </div>
                    <div className="message-list admin-message-list">
                        <p className="user-avatar">
                            <img src="http://wenwen.soso.com/p/20110819/20110819165923-448451987.jpg" alt="" />
                        </p>
                        <p className="admin-user">早上好</p>
                    </div> */}
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
                        <textarea name="" id="" cols="30" rows="10" ref={i => this.message = i} />
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

export default ChatWindow;
