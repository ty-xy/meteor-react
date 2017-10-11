import React, { Component } from 'react';

class ForgetPassword extends Component {
    render() {
        return (
            <div className="ejianlian-form-wrap ejianlian-forget-password">
                <div className="form-content-wrap container-middle forget-content">
                    <div className="register-title container-title">
                        忘记密码
                    </div>
                    <div className="form-content">
                        <ul className="forget-step">
                            <li className="forget-step-item">
                                <input type="text" placeholder="手机号" ref={i => this.usernmae = i} />
                            </li>
                            <li className="forget-step-item">
                                <input type="text" placeholder="验证码" />
                                <p className="obtainCode">获取验证码</p>
                            </li>
                            <li className="forget-step-item">
                                <input type="password" placeholder="新密码" ref={i => this.password = i} />
                            </li>
                        </ul>
                        <div className="forget-btn" onClick={this.register}>完成</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ForgetPassword;
