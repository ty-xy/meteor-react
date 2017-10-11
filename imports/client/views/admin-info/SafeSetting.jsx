import React, { Component } from 'react';

class SafeSetting extends Component {
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
    render() {
        return (
            <div className="safe-setting">
                <div className="login-account">
                    <div className="login-account-edit">
                        <p className="login-title">登录账号</p>
                        <p>15313385909 &nbsp;
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
                        <input type="password" placeholder="请您输入旧密码" />
                    </li>
                    <li>
                        <label htmlFor="newPassword">新密码</label>
                        <input type="password" placeholder="请您输入新密码" />
                    </li>
                    <li>
                        <label htmlFor="newPassword">确认密码</label>
                        <input type="password" placeholder="请您再次输入新密码" />
                    </li>
                    <li className="save-btn">
                        <button>保存</button>
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
                            <i className="icon icon-close-addFriend icon-close" onClick={this.handleEditAccount}>&#xe641;</i>
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
                            <i className="icon icon-close-codeBlock icon-close" onClick={this.handleShowEditAccountStep2}>&#xe641;</i>
                        </div>
                        <div className="edit-step-tip">
                            <img src="/editAccount2.png" alt="" />
                        </div>
                        <div>
                            <input type="number" placeholder="请输入手机号" className="input-password" />
                        </div>
                        <div className="code-container">
                            <input type="number" placeholder="请您输入验证码" className="code" />
                            <p>获取验证码</p>
                        </div>
                        <div className="next-btn" onClick={this.handleShowEditAccountStep2}>完成</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SafeSetting;
