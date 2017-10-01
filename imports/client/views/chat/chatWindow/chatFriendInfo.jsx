import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';


@pureRender
class ChatFriendInfo extends Component {
    render() {
        return (
            <div className="container-wrap friend-data-block">
                <div className="container-middle container-content">
                    <div className="container-title">
                        <i className="icon icon-close-admin-Block icon-close" onClick={this.props.handleFriendInfo}>&#xe641;</i>
                    </div>
                    <div className="friend-data-content">
                        <ul className="friend-info">
                            <li>
                                <img src="http://wenwen.soso.com/p/20110819/20110819165923-448451987.jpg" alt="" />
                            </li>
                            <li>
                                <p className="friend-name-info">
                                    <span>周工</span>
                                    <span>（周小妹）</span>
                                    <span style={{ color: '#29B6F6' }}>备注</span>
                                </p>
                                <p>
                                    <span>中艺装饰</span>
                                    <span>项目经理</span>
                                </p>
                            </li>
                            <li className="friend-code">
                                <i className="icon icon-ercode">&#xe619;</i>
                            </li>
                        </ul>
                        <p className="friend-data">
                            <i className="icon">&#xe660;</i>
                        15313385909
                        </p>
                        <p className="friend-data">
                            <i className="icon">&#xe66c;</i>
                        北京市朝阳区
                        </p>
                        <p className="friend-signature">签名  “滴水穿石，方得始终”</p>
                    </div>
                    <div className="friend-btn-wrap">
                        <div className="friend-btn">发送消息</div>
                        <div className="friend-btn">添加好友</div>
                    </div>
                </div>
            </div>
        );
    }
}
ChatFriendInfo.propTypes = {
    handleFriendInfo: PropTypes.func,
};

export default ChatFriendInfo;
