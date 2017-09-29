import React, { Component } from 'react';
import ContactList from './contact-list.jsx';
import FriendsList from './friends-list.jsx';
import GroupList from './group-list.jsx';
import '../../styles/chat.less';

class Chat extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            selected: 1,
        };
    }
    handleClick = (index) => {
        this.setState({ selected: index });
        console.log(this.state.selected);
    }
    chatSideNav() {
        return [
            { name: '消息', content: `icon1` },
            { name: '好友', content: 'icon2' },
            { name: '群组', content: 'icon3' },
        ]
    }
    render() {
        return (
            <div className="ejianlianChat">
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
                                this.chatSideNav().map((item, index) => (
                                        <li
                                            key={index}
                                            className="chat-to-message"
                                            style={{ color: this.state.selected === index + 1 ? '#29B6F6' : '#BBC1D7' }} onClick={this.handleClick.bind(this, index + 1)}
                                        >
                                            <p className="type-icon">
                                                <i className={item.content} />
                                                {/* <i className="icon icon-message icon-type-logo">{item.content}</i> */}
                                            </p>
                                            <p>{item.name}</p>
                                        </li>
                                    ))
                                }
                                {/* <li className="chat-to-message ">
                                    <p className="type-icon">
                                        <i className="icon icon-message icon-type-logo">&#xe64c;</i>
                                    </p>
                                    <p>消息</p>
                                </li>
                                <li className="chat-to-friend">
                                    <p className="type-icon">
                                        <i className="icon icon-friends icon-type-logo">&#xe6c3;</i>
                                    </p>
                                    <p>好友</p>
                                </li>
                                <li className="chat-to-group}">
                                    <p className="type-icon">
                                        <i className="icon icon-group icon-type-logo">&#xe624;</i>
                                    </p>
                                    <p>群组</p>
                                </li> */}
                            </ul>
                        </div>
                        <div className="ejianlian-chat-user-list">
                            <div>{this.state.selected}</div>
                            <ContactList style={{ display: this.state.selected === 1 ? 'block' : 'none' }} />
                            <FriendsList style={{ display: this.state.selected === 2 ? 'block' : 'none' }} />
                            <GroupList style={{ display: this.state.selected === 3 ? 'block' : 'none' }} />
                            {/* 消息列表 */}
                            {/* <div className="ejianlian-chat-message-list">
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
                                <div className="chat-user-pannel">
                                    <div className="user-avatar">
                                        <img src="http://wx.qlogo.cn/mmopen/An3cibgIYjcYeukMFYO9PdZCJbP5ftnShbibRKJ8RHX26qIV6FSJkribZCbTmv8Vlib8NVzvJCBtM2qMQBuzsdvDxUxcE7K8qTlV/0" alt=""/>
                                    </div>
                                    <div className="user-message">
                                        <p>张三<span className="message-createAt">12:00</span></p>
                                        <p className="last-message">
                                            <span>The Weather is good!</span>
                                            <span className="notice-red-dot">
                                                    200
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div> */}
                            {/*  */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;