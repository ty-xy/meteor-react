import React, { Component } from 'react';
import classNames from 'classnames';
import pureRender from 'pure-render-decorator';

import ContactList from './chatSideLeft/ContactList';
import FriendsList from './chatSideLeft/FriendsList';
import GroupList from './chatSideLeft/GroupList';
import AddChat from '../chat/chatSideLeft/addChat/AddChat';
import ChatWindow from './chatWindow/ChatWindow';


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
        };
    }
    handleClick = (index) => {
        this.setState({ selected: index });
    }
    render() {
        return (
            <div className="ejianlian-chat">
                <div className="left">
                    {/* 导航部分 */}
                    <div className="ejianlian-chat-nav">
                        <div className="chat-search">
                            <div className="chat-search-wrap">
                                <i className="icon icon-search-message">&#xe628;</i>
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
                                            <i className={classNames('iconfont', `${item.content}`)} />
                                        </p>
                                        <p>{item.name}</p>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="ejianlian-chat-user-list">
                        <ContactList style={{ display: this.state.selected === 1 ? 'block' : 'none' }} />
                        <FriendsList style={{ display: this.state.selected === 2 ? 'block' : 'none' }} />
                        <GroupList style={{ display: this.state.selected === 3 ? 'block' : 'none' }} />
                    </div>
                    <AddChat />
                </div>
                <ChatWindow />
            </div>
        );
    }
}

export default Chat;
