import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import pureRender from 'pure-render-decorator';

import Avatar from '../../../components/Avatar';
import feedback from '../../../../util/feedback';
import IdUtil from '../../../../util/id';

@pureRender
class ChatFriendInfo extends Component {
    static propTypes = {
        handleFriendInfo: PropTypes.func,
        user: PropTypes.object,
        friendId: PropTypes.string,
        chatUser: PropTypes.object,
        temporaryChat: PropTypes.bool,
        changeTo: PropTypes.func,
        handleToggle: PropTypes.func,
    };
    constructor(...args) {
        super(...args);
        this.state = {
            isAddFriend: false,
        };
    }
    handleAddFriend = () => {
        this.setState({
            isAddFriend: !this.state.isAddFriend,
        });
    }
    handleRequest = () => {
        this.setState({
            isAddFriend: !this.state.isAddFriend,
        });
        const { profile = {} } = this.props.chatUser || {};
        const { verifyFriend = '0' } = profile;
        if (verifyFriend === '0') {
            Meteor.call('verifyFriend', this.props.friendId, this.$verifyMessage.value, (err) => {
                if (err) {
                    console.error(err.reason);
                }
                feedback.dealSuccess('请求已发送,等待好友验证');
                this.props.handleFriendInfo();
            });
        } else if (verifyFriend === '1') {
            Meteor.call('addFriend', this.props.friendId, (err) => {
                if (err) {
                    console.error(err.reason);
                }
                feedback.dealSuccess('添加好友成功');
                this.props.handleFriendInfo();
            });
        } else {
            feedback.dealWarning('该用户设置了不允许任何人添加他为好友');
        }
    }
    deleteFriend = () => {
        Meteor.call('deleteFriend', this.props.friendId, (err) => {
            if (err) {
                console.error(err.reason);
            }
            this.props.changeTo('', '');
            feedback.dealSuccess('删除好友成功');
            this.props.handleFriendInfo();
        });
    }
    handleDeleteFriend = () => {
        this.props.handleFriendInfo();
        feedback.dealDelete('提示', '确定要删除该好友么?', this.deleteFriend);
    }
    handleTemporaryChat = () => {
        const haveChat = Meteor.user().profile.chatList.find(item => item.userId && item.userId === this.props.friendId);
        console.log(777, haveChat);
        if (haveChat) {
            // 已经存在聊天窗口,需要直接跳到对应的聊天窗口
            this.props.changeTo(IdUtil.merge(Meteor.userId(), this.props.friendId), this.props.friendId, '', 'message');
            this.props.handleToggle(IdUtil.merge(Meteor.userId(), this.props.friendId));
            this.props.handleFriendInfo();
            return;
        }
        Meteor.call('addTemporaryChat', this.props.friendId, (err) => {
            if (err) {
                console.error(err.reason);
            }
            this.props.handleFriendInfo();
        });
    }
    render() {
        const userProfile = this.props.user.profile || {};
        const userName = userProfile.name || '';
        const { profile = {}, username = '', _id = '' } = this.props.chatUser || {};
        const isFriend = userProfile && userProfile.friends && userProfile.friends.includes(_id);
        const { name = '', avatarColor = '', avatar = '', company = [], isHideInfo = false } = profile;
        const { temporaryChat = false } = this.props;
        return (
            <div className="container-wrap friend-data-block">
                <div className="opacity" onClick={this.props.handleFriendInfo} />
                <div className="container-middle container-content">
                    <div className="friend-data-content">
                        <p className="close-wrap"><i className="icon-guanbi iconfont" onClick={this.props.handleFriendInfo} /></p>

                        <ul className="friend-info">
                            <li className="friend-base-info">
                                <Avatar name={name} avatarColor={avatarColor} avatar={avatar} />
                                <p className="friend-name-info">
                                    {name}
                                </p>
                            </li>
                            {
                                this.props.friendId !== Meteor.userId() ?

                                    <li >
                                        {
                                            isFriend ?
                                                <button className="friend-btn" onClick={this.handleDeleteFriend}>删除好友</button>
                                                :
                                                <button className="friend-btn" onClick={this.handleAddFriend}>添加好友</button>
                                        }
                                    </li>
                                    :
                                    null
                            }

                        </ul>
                    </div>
                    <ul className="friend-details">
                        <li>
                            <p>用户名</p>
                            <p>{username}</p>
                        </li>
                        <li>
                            <p>昵称</p>
                            <p>{name}</p>
                        </li>
                        {
                            isHideInfo ?
                                null
                                :
                                company && company.length === 0 ?
                                    (<div className="user-company-info">
                                        <li>
                                            <p>公司</p>
                                            <p>哈哈</p>
                                        </li>
                                        {/* <li>
                                            <p>备注</p>
                                            <p>
                                                <span>笨蛋</span>&nbsp;
                                                <span><i className="iconfont icon-bianji1" /></span></p>
                                        </li> */}
                                    </div>)
                                    :
                                    null
                        }
                    </ul>
                    {
                        temporaryChat ?
                            <div className="friend-btn-wrap" style={{ display: this.state.isAddFriend ? 'none' : 'block' }}>
                                <button className="friend-btn" onClick={this.handleTemporaryChat}>
                                    <i className="iconfont icon-xiaoxi1" />&nbsp;
                            发送消息
                                </button>
                            </div>
                            :
                            null

                    }
                    {
                        this.state.isAddFriend ?
                            <div className="friend-add-send">
                                <div className="send-info">
                                    <p>请输入请求好友说明:</p>
                                    <p onClick={this.handleAddFriend}>返回</p>
                                </div>
                                <div className="send-confirm">
                                    <input type="text" defaultValue={`我是${userName}`} ref={i => this.$verifyMessage = i} />
                                    <button onClick={this.handleRequest}>发送</button>
                                </div>
                            </div>
                            :
                            null
                    }

                </div>
            </div>
        );
    }
}
export default withTracker(({ friendId }) => {
    Meteor.subscribe('users');
    const user = Meteor.user() || {};
    const chatUser = Meteor.users.findOne({ _id: friendId }) || {};
    return {
        user,
        chatUser,
        friendId,
    };
})(ChatFriendInfo);
