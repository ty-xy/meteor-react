import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

import ChatFriendInfo from '../../chatWindow/ChatFriendInfo';

@pureRender
class AddFriend extends Component {
    static propTypes = {
        isShowAddFriend: PropTypes.bool,
        handleAddFriend: PropTypes.func,
        handleFriendCode: PropTypes.func,
        isShowFriendCode: PropTypes.bool,
    };
    constructor(...args) {
        super(...args);
        this.state = {
            isShowFriendInfo: false,
            name: '哈哈',
            avatarColor: '#f58f47',
            username: '15733258134',
            friendId: '',
        };
    }
    searchFriend = () => {
        Meteor.call('searchFriend', this.username.value, (err, result) => {
            if (err) {
                return console.error(err.reason);
            }
            console.log(6666, result);
            this.setState({
                isShowAddFriend: false,
                isShowFriendInfo: true,
                name: result.profile.name || '',
                avatarColor: result.profile.avatarColor || '',
                username: result.username || '',
                friendId: result._id || '',
            });
        });
    }
    handleCloseResult = () => {
        this.setState({
            isShowFriendInfo: false,
        });
    }
    render() {
        return (
            <div>
                <div className="container-wrap add-friend-block" style={{ display: this.props.isShowAddFriend ? 'block' : 'none' }}>
                    <div className="container-middle container-content" >
                        <div className="container-title">
                        添加好友
                            <i className="icon icon-close-addFriend icon-close" onClick={this.props.handleAddFriend}>&#xe641;</i>
                        </div>
                        <div className="by-search-add-friend">
                            <input type="text" placeholder="手机号码添加" className="search-input" ref={i => this.username = i} />
                            <div className="search" onClick={this.searchFriend}>
                                <i className="icon icon-search-friend">&#xe628;</i>
                            </div>
                        </div>
                        <ul className="friend-other-style">
                            <li className="qq-style">
                                <p>
                                    <i className="icon icon-qq">&#xe601;</i>
                                </p>
                                <p className="icon-style-info">QQ</p>
                            </li>
                            <li>
                                <p>
                                    <i className="icon icon-wechat">&#xe6f6;</i>
                                </p>
                                <p className="icon-style-info">微信</p>
                            </li>
                            <li className="by-code" onClick={this.props.handleFriendCode}>
                                <p>
                                    <i className="icon icon-ercode">&#xe619;</i>
                                </p>
                                <p className="icon-style-info" >二维码</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="container-wrap look-code-block" style={{ display: this.props.isShowFriendCode ? 'block' : 'none' }} >
                    <div className="container-middle container-content">
                        <div className="container-title">
                             扫一扫
                            <i className="icon icon-close-codeBlock icon-close" onClick={this.props.handleFriendCode}>&#xe641;</i>
                        </div>
                        <div className="code-wrap">
                            <img src="http://upload-images.jianshu.io/upload_images/3297464-bcc37825a913c8ac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="" />
                        </div>
                        <p>保存或复制二维码发送好友成为e建联好友</p>
                        <div className="save-btn">
                            保存
                        </div>
                    </div>
                </div>
                {/* 搜索到的好友信息 */}
                <ChatFriendInfo
                    style={{ display: this.state.isShowFriendInfo ? 'block' : 'none' }}
                    handleFriendInfo={this.handleCloseResult}
                    name={this.state.name}
                    avatarColor={this.state.avatarColor}
                    username={this.state.username}
                    friendId={this.state.friendId}
                />
            </div>
        );
    }
}
export default AddFriend;
