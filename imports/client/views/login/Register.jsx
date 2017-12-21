import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { Form, Input, Row, Col, Checkbox, Button } from 'antd';

import feedback from '../../../util/feedback';
import regexp from '../../../util/regexp';

const FormItem = Form.Item;
@pureRender
class Register extends Component {
    static propTypes = {
        history: PropTypes.object,
        form: PropTypes.object,
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
        const form = this.props.form;
        const username = form.getFieldValue('username');
        if (!username) {
            return feedback.dealWarning('请输入正确的手机号');
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
        // const result = await Meteor.callPromise('sendRegisterSMS', username);
        // this.setState({
        //     BizId: result.BizId,
        // });
    }
    hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);
    login = (userId) => {
        const { history } = this.props;
        if (history.location && history.location.search && history.location.state === 'invite') {
            const search = `${history.location.search}&userId=${userId}`;
            history.push({ pathname: '/login', search, state: history.location.state });
            feedback.dealSuccess('注册成功');
        } else {
            history.push('/login');
        }
    }
    handleRegister = async (e) => {
        e.preventDefault();
        const form = this.props.form;
        if (this.state.countDownNum <= 0 && this.state.countDownNum >= 60) {
            return feedback.dealWarning('请重新接受验证码');
        }
        form.validateFieldsAndScroll(async (err, values) => {
            console.log(values);
            if (!err) {
                console.log('Received values of form: ', values);
            }
            if (!values.agreement) {
                return feedback.dealWarning('请先同意用户协议');
            }
            // if (!values.verificationCode) {
            //     return feedback.dealWarning('请输入验证码');
            // }
            // const queryResult = await Meteor.callPromise('queryDetail', values.username, this.state.BizId, Number(values.verificationCode));
            // if (!queryResult) {
            //     return feedback.dealWarning('请输入正确的验证码');
            // }
            Meteor.call('register', values, (error, userId) => {
                if (error) {
                    return feedback.dealError(error);
                }
                console.log(userId);
                Meteor.loginWithPassword(values.username, values.password);
            });
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const userNameError = isFieldTouched('username') && getFieldError('username');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const nameError = isFieldTouched('name') && getFieldError('name');
        const verificationCodeError = isFieldTouched('verificationCode') && getFieldError('verificationCode');

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        return (
            <div className="ejianlian-form-wrap ejianlian-register">
                <div className="form-content-wrap container-middle">
                    <div className="register-title container-title">
                        注册e建联
                    </div>
                    <div className="form-content">
                        <Form onSubmit={this.handleRegister}>
                            <FormItem
                                {...formItemLayout}
                                label="手机号"
                                validateStatus={userNameError ? 'error' : ''}
                                help={userNameError || ''}
                            >
                                {getFieldDecorator('username', {
                                    rules: [{
                                        required: true,
                                        pattern: regexp.phoneRe,
                                        message: '请输入正确的手机号!',
                                    }],
                                })(
                                    <Input placeholder="请输入手机号" />,
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="密码"
                                validateStatus={passwordError ? 'error' : ''}
                                help={passwordError || ''}
                            >
                                {getFieldDecorator('password', {
                                    rules: [{
                                        required: true,
                                        pattern: regexp.passwordRe,
                                        message: regexp.passwordTipInfo,
                                        whitespace: true,
                                    }, {
                                        validator: this.checkConfirm,
                                    }],
                                })(
                                    <Input type="password" placeholder={regexp.passwordTipInfo} />,
                                )}
                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                validateStatus={nameError ? 'error' : ''}
                                help={nameError || ''}
                                label={(<span>您的名字</span>)}
                            >
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入您的名字!', whitespace: true }],
                                })(
                                    <Input placeholder="您的名字" />,
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="验证码"
                                validateStatus={verificationCodeError ? 'error' : ''}
                                help={verificationCodeError || ''}
                            >
                                <Row gutter={8}>
                                    <Col span={12}>
                                        {getFieldDecorator('verificationCode', {
                                            rules: [{ required: true, message: '请输入正确的短信验证码' }],
                                        })(
                                            <Input placeholder="短信验证码" className="ant-input-lg" />,
                                        )}
                                    </Col>
                                    <Col span={12}>
                                        {
                                            this.state.sendBtnStatus === 0 ?
                                                <Button
                                                    className="obtainCode"
                                                    size="large"
                                                    onClick={this.sendMessage}
                                                >获取验证码</Button>
                                                :
                                                null
                                        }
                                        {
                                            this.state.sendBtnStatus === 1 ?
                                                <Button className="countDownBtn" >剩余{this.state.countDownNum}秒</Button>
                                                :
                                                null
                                        }
                                        {
                                            this.state.sendBtnStatus === 2 ?
                                                <Button className="obtainCode" onClick={this.sendMessage}>重新发送</Button>
                                                :
                                                null
                                        }
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem {...tailFormItemLayout} className="text-line">
                                {getFieldDecorator('agreement', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                })(
                                    <Checkbox >我已阅读并同意知工应用 <a href="https://www.baidu.com/">服务条款</a></Checkbox>,
                                )}
                            </FormItem>
                            <FormItem {...tailFormItemLayout} className="text-line">
                                <Button disabled={this.hasErrors(getFieldsError())} type="primary" htmlType="submit" className="register-btn">注册</Button>
                            </FormItem>
                            <FormItem {...tailFormItemLayout} className="text-line">
                                <div className="registered">已有账号,<span onClick={this.login}>立即登录</span></div>
                            </FormItem>
                        </Form>
                    </div>

                </div>
            </div>
        );
    }
}

export default Form.create()(Register);
