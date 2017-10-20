import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';

import ContactList from './chatSideLeft/ContactList';

import FriendsList from './chatSideLeft/FriendsList';
import GroupList from './chatSideLeft/GroupList';
import AddChat from '../chat/chatSideLeft/addChat/AddChat';
import ChatWindow from './chatWindow/ChatWindow';

// import NewFriend from './chatWindow/NewFriend';
// import ProjectNotice from './chatWindow/ProjectNotice';


@pureRender
class Chat extends Component {
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
        };
    }
    handleClick = (index) => {
        this.setState({ selected: index });
    }
    changeTo = (to, userId) => {
        this.setState({ to, userId });
    }
    render() {
        return (
            <div className="ejianlian-chat">
                <div className="left">
                    {/* 导航部分 */}
                    <div className="ejianlian-chat-nav">
                        <div className="chat-search">
                            <div className="chat-search-wrap">
                                <i className="iconfont icon-search-message icon-sousuo" />
                                <input type="text" className="search-message" placeholder="搜索" />
                            </div>
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
                        { this.state.selected === 1 ? <ContactList changeTo={this.changeTo} /> : null }
                        { this.state.selected === 2 ? <FriendsList /> : null }
                        { this.state.selected === 3 ? <GroupList /> : null }
                    </div>
                    <AddChat />
                </div>
                <ChatWindow to={this.state.to} userId={this.state.userId} />
                {/* <NewFriend /> */}
                {/* <ProjectNotice /> */}
            </div>
        );
    }
}

export default Chat;
