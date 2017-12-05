import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { Modal, Input } from 'antd';

import ChatFriendInfo from '../../chatWindow/ChatFriendInfo';
import Icon from '../../../../components/Icon';
import feedback from '../../../../../util/feedback';

const Search = Input.Search;
@pureRender
class AddFriend extends Component {
    static propTypes = {
        handleFriendCode: PropTypes.func,
        isShowFriendCode: PropTypes.bool,
    };
    constructor(...args) {
        super(...args);
        this.state = {
            isShowFriendInfo: false,
        };
    }
    searchFriend = (value) => {
        Meteor.call('searchFriend', value, (err, result) => {
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
    }
    render() {
        return (
            <div className="add-friend-wrap">
                <div className="add-friend-block">
                    <div className="by-search-add-friend">
                        <Search onSearch={this.searchFriend} placeholder="手机号码添加" />
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
                {
                    this.props.isShowFriendCode ?
                        <Modal
                            title="扫一扫"
                            visible
                            onCancel={this.props.handleFriendCode}
                            width={380}
                            wrapClassName="create-team-mask"
                            footer={null}
                        >
                            <div className="look-code-block">
                                <div className="code-wrap">
                                    <img src="http://upload-images.jianshu.io/upload_images/3297464-bcc37825a913c8ac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" alt="" />
                                </div>
                                <p>保存或复制二维码发送好友成为e建联好友</p>
                                <div className="save-btn">
                                    保存
                                </div>
                            </div>

                        </Modal>
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
