import React, { Component } from 'react';

class SafeSetting extends Component {
    render() {
        return (
            <div className="safe-setting">
                <div className="login-account">
                    <div className="login-account-edit">
                        <p className="login-title">登录账号</p>
                        <p>15313385909 &nbsp;
                            <span className="change-account">修改</span>
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

            </div>
        );
    }
}

export default SafeSetting;
