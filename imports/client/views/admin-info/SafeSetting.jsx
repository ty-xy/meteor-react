import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import Icon from '../../components/Icon';
import feedback from '../../../util/feedback';


class SafeSetting extends Component {
    static propTypes = {
        user: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isShowEditAccount: false,
            isShowEditAccountStep2: false,
        };
    }
    handleEditAccount = () => {
        this.setState({
            isShowEditAccount: !this.state.isShowEditAccount,
        });
    }
    handleShowEditAccountStep2 = () => {
        this.setState({
            isShowEditAccount: false,
            isShowEditAccountStep2: !this.state.isShowEditAccountStep2,
        });
    }
    saveChangeUserName = () => {
        Meteor.call('changeUserName', this.newUserName.value, (err) => {
            if (err) {
                feedback.dealError(err);
                return;
            }
            feedback.dealSuccess('用户名修改成功');
        });
        this.setState({
            isShowEditAccount: false,
            isShowEditAccountStep2: false,
        });
    }
    saveChangePassword = () => {
        if (this.$newPassword.value && this.$newRePassword.value && this.$oldPassword.value) {
            if (this.$newPassword.value !== this.$newRePassword.value) {
                feedback.dealWarning('两次输入的密码不一致');
                return;
            }
            Meteor.call('changeUserPassword', this.$oldPassword.value, this.$newPassword.value, (err) => {
                if (err) {
                    feedback.dealError(err);
                    return;
                }

                feedback.dealSuccess('密码修改成功');
            });
        } else {
            feedback.dealWarning('请输入密码');
        }
    }
    render() {
        const { username } = this.props.user;
        return (
            <div className="safe-setting">
                <div className="login-account">
                    <div className="login-account-edit">
                        <p className="login-title">登录账号</p>
                        <p>{username} &nbsp;
                            <span className="change-account" onClick={this.handleEditAccount}>修改</span>
                        </p>
                    </div>
                    <div className="edit-login-tip">
                        修改后登录账号与您的信息都将变化
                    </div>
                </div>
                <ul>
                    <li>
                        <label htmlFor="editPassword">修改密码</label>
                    </li>
                    <li>
                        <label htmlFor="oldPassword">旧密码</label>
                        <input type="password" placeholder="请您输入旧密码" ref={i => this.$oldPassword = i} />
                    </li>
                    <li>
                        <label htmlFor="newPassword">新密码</label>
                        <input type="password" placeholder="请您输入新密码" ref={i => this.$newPassword = i} />
                    </li>
                    <li>
                        <label htmlFor="newPassword">确认密码</label>
                        <input type="password" placeholder="请您再次输入新密码" ref={i => this.$newRePassword = i} />
                    </li>
                    <li className="save-btn">
                        <button onClick={this.saveChangePassword}>保存</button>
                    </li>
                </ul>
                <ul>
                    <li>第三方登录</li>
                    <li className="bind-qq bind-other">
                        <p className="qq-logo">
                            <i className="iconfont icon-qq-copy" />
                        </p>
                        <p>QQ</p>
                        <p className="bind-btn">绑定</p>
                    </li>
                    <li className="bind-wechat bind-other">
                        <p className="wechat-logo">
                            <i className="iconfont icon-weixin" />
                        </p>
                        <p>微信</p>
                        <p className="bind-btn">解除绑定</p>
                    </li>
                </ul>
                <div className="container-wrap" style={{ display: this.state.isShowEditAccount ? 'block' : 'none' }}>
                    <div className="container-middle container-content edit-account-block1" >
                        <div className="container-title">
                            修改登录账号
                            <Icon icon="icon-guanbi icon-close" size={20} onClick={this.handleEditAccount} />
                        </div>
                        <div className="edit-step-tip">
                            <img src="/editAccount1.png" alt="" />
                        </div>
                        <div>
                            <input type="password" placeholder="请输入登录密码" className="input-password" />
                        </div>
                        <div className="next-btn" onClick={this.handleShowEditAccountStep2}>下一步</div>
                    </div>
                </div>
                <div className="container-wrap" style={{ display: this.state.isShowEditAccountStep2 ? 'block' : 'none' }} >
                    <div className="container-middle container-content edit-account-block">
                        <div className="container-title">
                            修改登录账号
                            <Icon icon="icon-guanbi icon-close" size={20} onClick={this.handleShowEditAccountStep2} />
                        </div>
                        <div className="edit-step-tip">
                            <img src="/editAccount2.png" alt="" />
                        </div>
                        <div>
                            <input type="number" placeholder="请输入手机号" className="input-password" ref={i => this.$newUserName = i} />
                        </div>
                        <div className="code-container">
                            <input type="number" placeholder="请您输入验证码" className="code" />
                            <p>获取验证码</p>
                        </div>
                        <div className="next-btn" onClick={this.saveChangeUserName}>完成</div>
                    </div>
                </div>
            </div>
        );
    }
}


export default withTracker(() => ({
    user: Meteor.user() || {},
}))(SafeSetting);
