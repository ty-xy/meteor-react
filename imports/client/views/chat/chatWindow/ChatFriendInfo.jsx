import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import pureRender from 'pure-render-decorator';
import Avatar from '../../../components/Avatar';


@pureRender
class ChatFriendInfo extends Component {
    static propTypes = {
        handleFriendInfo: PropTypes.func,
        name: PropTypes.string,
        avatarColor: PropTypes.string,
        username: PropTypes.string,
        user: PropTypes.object,
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
    render() {
        const { profile } = this.props.user || {};
        const { name } = profile || '';
        return (
            <div className="container-wrap friend-data-block">
                <div className="container-middle container-content">
                    <div className="friend-data-content">
                        <p className="close-wrap"><i className="icon-guanbi iconfont" onClick={this.props.handleFriendInfo} /></p>

                        <ul className="friend-info">
                            <li>
                                <Avatar name={this.props.name} avatarColor={this.props.avatarColor} />
                            </li>
                            <li>
                                <p className="friend-name-info">
                                    <span>{this.props.name}</span>
                                </p>
                            </li>
                            <li >
                                <button className="friend-btn" onClick={this.handleAddFriend}>添加好友</button>
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
                        {/* <li>
                            <p>公司</p>
                            <p>{this.props.username}</p>
                        </li>
                        <li>
                            <p>备注</p>
                            <p>
                                <span>笨蛋</span>&nbsp;
                                <span><i className="iconfont icon-bianji1" /></span></p>
                        </li> */}
                    </ul>
                    <div className="friend-btn-wrap" style={{ display: this.state.isAddFriend ? 'none' : 'block' }}>
                        <button className="friend-btn">
                            <i className="iconfont icon-xiaoxi1" />&nbsp;
                            发送消息
                        </button>
                    </div>
                    <div className="friend-add-send" style={{ display: this.state.isAddFriend ? 'block' : 'none' }}>
                        <div className="send-info">
                            <p>请输入请求好友说明:</p>
                            <p onClick={this.handleAddFriend}>返回</p>
                        </div>
                        <div className="send-confirm">
                            <input type="text" defaultValue={`我是${name}`} />
                            <button>发送</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withTracker(() => ({
    user: Meteor.user(),
}))(ChatFriendInfo);
