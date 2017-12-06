import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

import feedback from '../../../util/feedback';

@pureRender
class Register extends Component {
    static propTypes = {
        history: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            registerError: '',
            countDownNum: 60,
            sendBtnStatus: 0,
            BizId: '',
        };
    }
    sendMessage = async () => {
        if (!(/^1[34578]\d{9}$/.test(this.username.value))) {
            feedback.dealWarning('请输入正确的手机号');
        }
        this.setState({
            sendBtnStatus: 1,
        });
        let countDownNum = this.state.countDownNum;
        const countDownDate = setInterval(() => {
            countDownNum--;
            this.setState({
                countDownNum,
            });
            if (countDownNum <= 0) {
                this.setState({
                    sendBtnStatus: 2,
                    countDownNum: 60,
                });
                clearInterval(countDownDate);
            }
        }, 1000);
        const result = await Meteor.callPromise('sendRegisterSMS', this.username.value);
        this.setState({
            BizId: result.BizId,
        });
    }
    register = async () => {
        if (this.state.countDownNum <= 0 && this.state.countDownNum >= 60) {
            return feedback.dealWarning('请重新接受验证码');
        }
        if (!this.yanzhengma.value) {
            return feedback.dealWarning('请输入验证码');
        }

        const queryResult = await Meteor.callPromise('queryDetail', this.username.value, this.state.BizId, Number(this.yanzhengma.value));
        if (!queryResult) {
            return feedback.dealWarning('请输入正确的验证码');
        }
        const { history } = this.props;
        Meteor.call('register', this.username.value, this.password.value, this.name.value, (err, userId) => {
            if (err) {
                this.setState({
                    registerError: err.reason,
                });
                return console.error(err.reason);
            }
            Meteor.loginWithPassword(this.username.value, this.password.value);
            this.login(history, userId);
        });
    }
    login = (history, userId) => {
        // this.props.history.push('/chat');
        if (history.location.search && history.location.state === 'invite') {
            const search = `${history.location.search}&userId=${userId}`;
            history.push({ pathname: '/chat', search, state: history.location.state });
            feedback.dealSuccess('注册成功');
        } else {
            history.push('/chat');
        }
    }
    render() {
        const { history } = this.props;
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
                                <input type="number" placeholder="验证码" ref={i => this.yanzhengma = i} />
                                {
                                    this.state.sendBtnStatus === 0 ?
                                        <button className="obtainCode" onClick={this.sendMessage}>获取验证码</button>
                                        :
                                        null
                                }
                                {
                                    this.state.sendBtnStatus === 1 ?
                                        <button className="obtainCode" style={{ background: '#b2b2b2' }} >剩余{this.state.countDownNum}秒</button>
                                        :
                                        null
                                }
                                {
                                    this.state.sendBtnStatus === 2 ?
                                        <button className="obtainCode" onClick={this.sendMessage}>重新发送</button>
                                        :
                                        null
                                }

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
                        <div className="registered">已有账号,<span onClick={() => this.login(history, '')}>立即登录</span></div>
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
