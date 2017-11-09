import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

import ContactList from './chatSideLeft/ContactList';
import FriendsList from './chatSideLeft/FriendsList';
import GroupList from './chatSideLeft/GroupList';
import AddChat from '../chat/chatSideLeft/addChat/AddChat';
import ChatWindow from './chatWindow/ChatWindow';
import UserUtil from '../../../util/user';
import feedback from '../../../util/feedback';

import NewFriend from './chatWindow/NewFriend';
import SearchChat from '../../features/SearchChat';
// import ProjectNotice from './chatWindow/ProjectNotice';


@pureRender
class Chat extends Component {
    static propTypes = {
        chatList: PropTypes.array,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            selected: 1,
            chatSideNav: [
                { name: '消息', content: 'icon-xiaoxi' },
                { name: '好友', content: 'icon-group' },
                { name: '群组', content: 'icon-qunzu' },
            ],
            to: '',
            userId: '',
            selectedChat: {},
            chatType: 'message',
        };
    }
    handleNewFriend = () => {
        this.setState({
            chatType: 'newFriend',
        });
    }
    handleClick = (index) => {
        this.setState({
            selected: index,
        });
    }
    changeTo = (to, userId, type, chatType) => {
        // 有未读消息(有用户所在的群以及发给用户的消息)且不在聊天列表时,创建新的聊天窗口
        if (type && !this.props.chatList.find(item => item[type] === userId)) {
            Meteor.call('addChatList', userId, type, (err) => {
                feedback.dealError(err);
            });
        }
        this.handleToggle(userId);
        this.setState({ to, userId, chatType });
    }
    handleToggle = (value) => {
        this.setState({
            selectedChat: {
                [value]: true,
            },
        });
    }
    render() {
        return (
            <div className="ejianlian-chat">
                <div className="left">
                    {/* 导航部分 */}
                    <div className="ejianlian-chat-nav">
                        <div className="chat-search">
                            <SearchChat />
                        </div>
                        <ul className="chat-type">
                            {
                                this.state.chatSideNav.map((item, index) => (
                                    <li
                                        key={index}
                                        className="chat-to-message"
                                        style={{ color: this.state.selected === index + 1 ? '#29B6F6' : '#BBC1D7' }}
                                        onClick={this.handleClick.bind(this, index + 1)}
                                    >
                                        <p className="type-icon">
                                            <i className={`iconfont ${item.content}`} />
                                        </p>
                                        <p>{item.name}</p>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="ejianlian-chat-user-list">
                        {this.state.selected === 1 ?
                            <ContactList
                                changeTo={this.changeTo}
                                handleToggle={this.handleToggle}
                                selectedChat={this.state.selectedChat}
                                handleNewFriend={this.handleNewFriend}
                            /> : null}
                        {this.state.selected === 2 ?
                            <FriendsList
                                changeTo={this.changeTo}
                                handleClick={this.handleClick.bind(this, 1)}
                                handleNewFriend={this.handleNewFriend}
                            /> : null}
                        {this.state.selected === 3 ?
                            <GroupList
                                changeTo={this.changeTo}
                                handleClick={this.handleClick.bind(this, 1)}
                            /> : null}
                    </div>
                    <AddChat
                        changeTo={this.changeTo}
                        handleToggle={this.handleToggle}
                    />
                </div>
                {
                    this.state.chatType === 'newFriend' ?
                        <NewFriend />
                        :
                        <ChatWindow to={this.state.to} userId={this.state.userId} changeTo={this.changeTo} handleToggle={this.handleToggle} />
                }


                {/* <ProjectNotice /> */}
            </div>
        );
    }
}


export default withTracker(() => {
    Meteor.subscribe('users');
    Meteor.subscribe('message');
    const chatList = UserUtil.getChatList();
    return {
        chatList,
    };
})(Chat);
