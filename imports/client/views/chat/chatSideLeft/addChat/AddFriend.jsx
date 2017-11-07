import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

import ChatFriendInfo from '../../chatWindow/ChatFriendInfo';
import Icon from '../../../../components/Icon';
import feedback from '../../../../../util/feedback';

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
        };
    }
    searchFriend = () => {
        Meteor.call('searchFriend', this.username.value, (err, result) => {
            feedback.dealError(err);
            if (result) {
                this.setState({
                    isShowAddFriend: false,
                    isShowFriendInfo: true,
                    friendId: result._id || '',
                });
            }
        });
    }
    handleCloseResult = () => {
        this.setState({
            isShowFriendInfo: false,
        });
        this.props.handleAddFriend();
    }
    render() {
        return (
            <div>
                <div className="container-wrap add-friend-block" style={{ display: this.props.isShowAddFriend ? 'block' : 'none' }}>
                    <div className="container-middle container-content" >
                        <div className="container-title">
                        添加好友
                            <Icon icon="icon-guanbi icon icon-close" onClick={this.props.handleAddFriend} />
                        </div>
                        <div className="by-search-add-friend">
                            <input type="text" placeholder="手机号码添加" className="search-input" ref={i => this.username = i} />
                            <div className="search" onClick={this.searchFriend}>
                                <Icon icon="icon-sousuo icon icon-search-friend" />
                            </div>
                        </div>
                        <ul className="friend-other-style">
                            <li className="qq-style">
                                <p>
                                    <Icon icon="icon-qq-copy icon icon-qq" />
                                </p>
                                <p className="icon-style-info">QQ</p>
                            </li>
                            <li>
                                <p>
                                    <Icon icon="icon-weixin icon icon-wechat" />
                                </p>
                                <p className="icon-style-info">微信</p>
                            </li>
                            <li className="by-code" onClick={this.props.handleFriendCode}>
                                <p>
                                    <Icon icon="icon-erweima icon icon-ercode" />
                                </p>
                                <p className="icon-style-info" >二维码</p>
                            </li>
                        </ul>
                    </div>
                </div>

                {
                    this.props.isShowFriendCode ?
                        <div className="container-wrap look-code-block">
                            <div className="container-middle container-content">
                                <div className="container-title">
                             扫一扫
                                    <Icon icon="icon-guanbi icon icon-close-codeBlock icon-close"onClick={this.props.handleFriendCode} />
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
                        :
                        null
                }
                {/* 搜索到的好友信息 */}
                {
                    this.state.isShowFriendInfo ?
                        <ChatFriendInfo
                            handleFriendInfo={this.handleCloseResult}
                            friendId={this.state.friendId}
                        />
                        :
                        null
                }
            </div>
        );
    }
}
export default AddFriend;
