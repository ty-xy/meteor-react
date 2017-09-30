import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

@pureRender
class AddFriend extends Component {
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
                            <input type="text" placeholder="手机号码添加" className="search-input" />
                            <div className="search">
                                <i className="icon icon-search-friend">&#xe628;</i>
                            </div>
                        </div>
                        <ul className="friend-other-style">
                            <li>
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
            </div>
        );
    }
}
AddFriend.propTypes = {
    isShowAddFriend: PropTypes.bool,
    handleAddFriend: PropTypes.func,
    handleFriendCode: PropTypes.func,
    isShowFriendCode: PropTypes.bool,
};
export default AddFriend;
