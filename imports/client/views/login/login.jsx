import React, { Component } from 'react';
import '../../styles/view/login/login.less';

class Login extends Component {
    render() {
        return (
            <div className="ejianlian-login">
                <div className="login-content container-middle">
                    <div className="login-title container-title">
                        登录e建联
                    </div>
                    <div className="login-step-wrap">
                        <div className="login-step">
                            <p className="login-phone login-step-item">
                                <i className="icon">&#xe616;</i>
                                <input type="text" placeholder="手机号" />
                            </p>
                            <p className="login-passward login-step-item">
                                <i className="icon">&#xe616;</i>
                                <input type="text" placeholder="密码" />
                            </p>
                        </div>
                        <div className="login-btn">登录</div>
                        <div className="login-server">
                            <p>注册账号</p>
                            <p>忘记密码</p>
                        </div>
                        <div className="login-by-other">
                            <div className="login-style-wrap">
                                <p className="login-line" />
                                <p> 第三方登录</p>
                                <p className="login-line" />

                            </div>
                            <div className="login-style" >
                                <p><i className="icon">&#xe601;</i></p>
                                <p><i className="icon icon-wechat">&#xe6f6;</i></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
