import React, { Component } from 'react';

class LoginInCode extends Component {
    render() {
        return (
            <div className="ejianlian-form-wrap ejianlian-login-in-code">
                <div className="form-content-wrap container-middle">
                    <div className="register-title container-title">
                        扫码登录e建联
                    </div>
                    <div className="form-content">
                        <ul className="register-step">
                            <li>
                                <input type="text" placeholder="手机号" ref={i => this.usernmae = i} />
                            </li>
                            <li>
                                <input type="text" placeholder="验证码" />
                                <p className="obtainCode">获取验证码</p>
                            </li>
                            <li>
                                <input type="password" placeholder="新密码" ref={i => this.password = i} />
                            </li>
                        </ul>
                        <div className="register-btn" onClick={this.register}>完成</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginInCode;
