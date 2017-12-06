import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { Form, Icon, Input, Button } from 'antd';
import feedback from '../../../util/feedback';

import regexp from '../../../util/regexp';

const FormItem = Form.Item;
@pureRender
class Login extends Component {
    static propTypes = {
        history: PropTypes.object,
        location: PropTypes.object,
        form: PropTypes.object,
    }
    componentWillReceiveProps() {
        if (this.props.location.search) {
            this.props.history.replace({ pathname: '/login', search: this.props.location.search, state: 'invite' });
        }
    }
    gotoRegister = () => {
        this.props.history.push({ pathname: '/register', search: this.props.location.search, state: this.props.location.search && 'invite' });
    }
    gotoForgetPassword = () => {
        this.props.history.push('/forgetPassword');
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }
    hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field])
    handleLogin = (e) => {
        const { history } = this.props;
        e.preventDefault();
        this.props.form.validateFields((error, values) => {
            console.log(values);
            if (!error) {
                console.log('Received values of form: ', values);
            }
            Meteor.loginWithPassword(
                values.userName,
                values.password,
                (err) => {
                    if (err) {
                        feedback.dealError(err.reason);
                        return console.error(err.reason);
                    }
                    // this.props.history.push('/chat');
                    history.push({ pathname: '/chat', search: history.location.search, state: history.location.state });
                },
            );
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const userNameError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        return (
            <div className="ejianlian-login ejianlian-form-wrap">
                <div className="login-content container-middle form-content-wrap">
                    <div className="login-title container-title">
                        登录e建联
                    </div>
                    <div className="form-content">
                        <Form onSubmit={this.handleLogin} className="login-form">
                            <FormItem
                                validateStatus={userNameError ? 'error' : ''}
                                help={userNameError || ''}
                            >
                                {getFieldDecorator('userName', {
                                    rules: [{
                                        required: true,
                                        pattern: regexp.phoneRe,
                                        message: '请输入正确的手机号!',
                                    }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号" />,
                                )}
                            </FormItem>
                            <FormItem
                                validateStatus={passwordError ? 'error' : ''}
                                help={passwordError || ''}
                            >
                                {getFieldDecorator('password', {
                                    rules: [{
                                        required: true,
                                        pattern: regexp.passwordRe,
                                        message: '请输入正确的密码!',
                                        whitespace: true,
                                    }],
                                }, {
                                    validator: this.checkConfirm,
                                })(
                                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />,
                                )}
                            </FormItem>
                            <FormItem>
                                <Button disabled={this.hasErrors(getFieldsError())} type="primary" htmlType="submit" className="login-btn">
                                    登录
                                </Button>
                            </FormItem>
                        </Form>
                        <div className="login-server">
                            <button onClick={this.gotoRegister}>注册账号</button>
                            <button onClick={this.gotoForgetPassword}>忘记密码</button>
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

export default Form.create()(Login);
