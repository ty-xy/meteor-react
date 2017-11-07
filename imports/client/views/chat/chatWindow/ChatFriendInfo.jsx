import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import pureRender from 'pure-render-decorator';

import Avatar from '../../../components/Avatar';
import feedback from '../../../../util/feedback';

@pureRender
class ChatFriendInfo extends Component {
    static propTypes = {
        handleFriendInfo: PropTypes.func,
        name: PropTypes.string,
        avatarColor: PropTypes.string,
        username: PropTypes.string,
        user: PropTypes.object,
        friendId: PropTypes.string,
        avatar: PropTypes.string,
        company: PropTypes.array,
        isHideInfo: PropTypes.bool,
        verifyFriend: PropTypes.string,
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
        if (this.props.verifyFriend === '0') {
            Meteor.call('verifyFriend', this.props.friendId, this.$verifyMessage.value, (err) => {
                if (err) {
                    console.error(err.reason);
                }
                feedback.dealSuccess('请求已发送,等待好友验证');
                this.props.handleFriendInfo();
            });
        } else if (this.props.verifyFriend === '1') {
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
            feedback.dealSuccess('删除好友成功');
            this.props.handleFriendInfo();
        });
    }
    handleDeleteFriend = () => {
        feedback.dealDelete('提示', '确定要删除该好友么?', this.deleteFriend);
    }
    render() {
        const { profile = {} } = this.props.user;
        const { name = '' } = profile;
        const isFriend = profile && profile.friends && profile.friends.includes(this.props.friendId);
        return (
            <div className="container-wrap friend-data-block">
                <div className="opacity" onClick={this.props.handleFriendInfo} />
                <div className="container-middle container-content">
                    <div className="friend-data-content">
                        <p className="close-wrap"><i className="icon-guanbi iconfont" onClick={this.props.handleFriendInfo} /></p>

                        <ul className="friend-info">
                            <li>
                                <Avatar name={this.props.name} avatarColor={this.props.avatarColor} avatar={this.props.avatar} />
                            </li>
                            <li>
                                <p className="friend-name-info">
                                    <span>{this.props.name}</span>
                                </p>
                            </li>
                            <li >
                                {
                                    isFriend ?
                                        <button className="friend-btn" onClick={this.handleDeleteFriend}>删除好友</button>
                                        :
                                        <button className="friend-btn" onClick={this.handleAddFriend}>添加好友</button>
                                }
                            </li>
                        </ul>
                    </div>
                    <ul className="friend-details">
                        <li>
                            <p>用户名</p>
                            <p>{this.props.username}</p>
                        </li>
                        <li>
                            <p>昵称</p>
                            <p>{this.props.name}</p>
                        </li>
                        {
                            this.props.isHideInfo ?
                                null
                                :
                                this.props.company && this.props.company.length === 0 ?
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
                    <div className="friend-add-send" style={{ display: this.state.isAddFriend ? 'block' : 'none' }}>
                        <div className="send-info">
                            <p>请输入请求好友说明:</p>
                            <p onClick={this.handleAddFriend}>返回</p>
                        </div>
                        <div className="send-confirm">
                            <input type="text" defaultValue={`我是${name}`} ref={i => this.$verifyMessage = i} />
                            <button onClick={this.handleRequest}>发送</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withTracker(() => ({
    user: Meteor.user() || {},
}))(ChatFriendInfo);
