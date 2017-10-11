import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';

@pureRender
class ContactList extends Component {
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
                <div className="chat-user-pannel">
                    <div className="user-avatar">
                        <img src="http://wx.qlogo.cn/mmopen/An3cibgIYjcYeukMFYO9PdZCJbP5ftnShbibRKJ8RHX26qIV6FSJkribZCbTmv8Vlib8NVzvJCBtM2qMQBuzsdvDxUxcE7K8qTlV/0" alt="" />
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
            </div>
        );
    }
}

export default ContactList;
