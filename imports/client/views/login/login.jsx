import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';


@pureRender
class Login extends Component {
    static propTypes = {
        history: PropTypes.object,
    }
    login = () => {
        Meteor.loginWithPassword(
            this.username.value,
            this.password.value,
            (err) => {
                if (err) {
                    return console.error(err.reason);
                }
                this.props.history.push('/chat');
            },
        );
    }
    gotoRegister = () => {
        this.props.history.push('/register');
    }
    render() {
        return (
            <div className="ejianlian-login ejianlian-form-wrap">
                <div className="login-content container-middle form-content-wrap">
                    <div className="login-title container-title">
                        登录e建联
                    </div>
                    <div className="form-content">
                        <div className="login-step">
                            <p className="login-phone login-step-item">
                                <i className="icon">&#xe616;</i>
                                <input type="text" placeholder="手机号" ref={i => this.username = i} />
                            </p>
                            <p className="login-passward login-step-item">
                                <i className="icon">&#xe616;</i>
                                <input type="password" placeholder="密码" ref={i => this.password = i} />
                            </p>
                        </div>
                        <div className="login-btn" onClick={this.login}>登录</div>
                        <div className="login-server">
                            <p onClick={this.gotoRegister}>注册账号</p>
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
