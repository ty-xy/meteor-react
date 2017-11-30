import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

// import feedback from '../../../util/feedback';
// import UserUtil from '../../../util/user';

@pureRender
class Login extends Component {
    static propTypes = {
        history: PropTypes.object,
        location: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            loginError: '',
        };
    }
    componentWillReceiveProps() {
        if (this.props.location.search) {
            this.props.history.replace({ pathname: '/login', search: this.props.location.search, state: 'invite' });
        }
    }
    login = () => {
        const { history } = this.props;
        Meteor.loginWithPassword(
            this.username.value,
            this.password.value,
            (err) => {
                if (err) {
                    this.setState({
                        loginError: err.reason,
                    });
                    return console.error(err.reason);
                }
                // this.props.history.push('/chat');
                history.push({ pathname: '/chat', search: history.location.search, state: history.location.state });
            },
        );
    }
    gotoRegister = () => {
        this.props.history.push({ pathname: '/register', search: this.props.location.search, state: this.props.location.search && 'invite' });
    }
    gotoForgetPassword = () => {
        this.props.history.push('/forgetPassword');
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
                                <i className="iconfont icon-user" />
                                <input type="text" placeholder="手机号" ref={i => this.username = i} />
                            </p>
                            <p className="login-passward login-step-item">
                                <i className="iconfont icon-denglu-mima" />
                                <input type="password" placeholder="密码" ref={i => this.password = i} />
                            </p>
                        </div>
                        <p className="login-error">{this.state.loginError}</p>
                        <div className="login-btn" onClick={this.login}>登录</div>
                        <div className="login-server">
                            <p onClick={this.gotoRegister}>注册账号</p>
                            <p onClick={this.gotoForgetPassword}>忘记密码</p>
                        </div>
                        <div className="login-by-other">
                            <div className="login-style-wrap">
                                <p className="login-line" />
                                <p> 第三方登录</p>
                                <p className="login-line" />

                            </div>
                            <div className="login-style" >
                                <p><i className="iconfont icon-qq-copy" /></p>
                                <p><i className="iconfont icon-weixin icon-wechat" /></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
