import React, { Component } from 'react';

class ChatFriendInfo extends Component {
    render() {
        return (
            <div>
                <div className="container-wrap account-data-block">
                    <div className="container-middle container-content">
                        <div className="container-title">
                            <i className="icon icon-close-admin-Block icon-close">&#xe641;</i>
                        </div>
                        <div className="account-data-content">
                            <ul className="account-info">
                                <li>
                                    <img src="http://wenwen.soso.com/p/20110819/20110819165923-448451987.jpg" alt="" />
                                </li>
                                <li>
                                    <p className="account-name-info">
                                        <span>周工</span>
                                        <span>（周小妹）</span>
                                        <span style={{ color: '#29B6F6' }}>备注</span>
                                    </p>
                                    <p>
                                        <span>中艺装饰</span>
                                        <span>项目经理</span>
                                    </p>
                                </li>
                                <li className="account-code">
                                    <i className="icon icon-ercode">&#xe619;</i>
                                </li>
                            </ul>
                            <p className="account-data">
                                <i className="icon">&#xe660;</i>
                        15313385909
                            </p>
                            <p className="account-data">
                                <i className="icon">&#xe66c;</i>
                        北京市朝阳区
                            </p>
                            <p className="account-signature">签名  “滴水穿石，方得始终”</p>
                        </div>
                        <div className="account-btn-wrap">
                            <div className="account-btn">发送消息</div>
                            <div className="account-btn">添加好友</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatFriendInfo;
