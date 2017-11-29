import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

import feedback from '../../../util/feedback';

@pureRender
class Register extends Component {
    static propTypes = {
        history: PropTypes.object,
        location: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            registerError: '',
        };
    }
    register = () => {
        const { location } = this.props;
        const _this = this;
        Meteor.call('register', this.username.value, this.password.value, this.name.value, (err, userId) => {
            if (err) {
                this.setState({
                    registerError: err.reason,
                });
                return console.error(err.reason);
            }
            Meteor.loginWithPassword(this.username.value, this.password.value);
            if (location.search && location.state === 'invite') {
                const search = location.search.slice(1).split('&');
                const searchs = {};
                search.forEach((item) => {
                    searchs[item.split('=')[0]] = item.split('=')[1];
                });
                if (searchs.companyId) {
                    const { companyId, groupId, dep } = searchs;
                    Meteor.call(
                        'addMember',
                        { companyId, userId, name: _this.name.value, dep, groupId, pos: '', invite: true },
                        (e, r) => {
                            if (e) {
                                feedback.dealError('添加失败');
                                return false;
                            }
                            feedback.dealSuccess(r || '注册成功, 且成功加入该团队');
                        },
                    );
                }
            } else {
                feedback.dealSuccess('注册成功');
            }
            this.login();
        });
    }
    login = () => {
        this.props.history.push('/chat');
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
                        <p className="register-error">{this.state.registerError}</p>
                        <div className="register-btn" onClick={this.register}>完成</div>
                        <div className="registered">已有账号,<span onClick={this.login}>立即登录</span></div>
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
                        <p className="agreeProto">注册即同意知工应用<span>服务条款</span></p>
                    </div>

                </div>
            </div>
        );
    }
}

export default Register;
