import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import pureRender from 'pure-render-decorator';


@pureRender
class Register extends Component {
    register = () => {
        const colorArr = ['#29b6f6', '#f58f47', '#5ad186', '#8b91e8', '#f55b89', '#ffc400'];
        const randomIndex = Math.ceil(Math.random() * colorArr.length);
        const avatarColor = colorArr[randomIndex];
        Meteor.call('register', this.username.value, this.password.value, this.name.value, avatarColor, (err) => {
            if (err) {
                return console.error(err.reason);
            }
            Meteor.loginWithPassword(this.username.value, this.password.value);
        });
    }
    render() {
        return (
            <div className="ejianlian-form-wrap ejianlian-register">
                <div className="form-content-wrap container-middle">
                    <div className="register-title container-title">
                        注册e建联
                    </div>
                    <div className="form-content">
                        <ul className="register-step">
                            <li>
                                <input type="text" placeholder="手机号" ref={i => this.username = i} />
                            </li>
                            <li>
                                <input type="text" placeholder="验证码" />
                                <p className="obtainCode">获取验证码</p>
                            </li>
                            <li>
                                <input type="password" placeholder="密码" ref={i => this.password = i} />
                            </li>
                            <li>
                                <input type="text" placeholder="您的名字" ref={i => this.name = i} />
                            </li>
                        </ul>
                        <div className="register-btn" onClick={this.register}>完成</div>
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
                        <p className="agreeProto">注册即同意知工应用<span>服务条款</span></p>
                    </div>

                </div>
            </div>
        );
    }
}

export default Register;
