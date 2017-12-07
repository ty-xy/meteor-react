import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Form, Input, Row, Col, Button, Modal } from 'antd';
import { Accounts } from 'meteor/accounts-base';

import feedback from '../../../util/feedback';
import regexp from '../../../util/regexp';

const FormItem = Form.Item;
class SafeSetting extends Component {
    static propTypes = {
        user: PropTypes.object,
        form: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isShowEditAccount: false,
            countDownNum: 60,
            sendBtnStatus: 0,
            BizId: '',
        };
    }
    showEditAccount = () => {
        this.setState({
            isShowEditAccount: true,
        });
    }
    closeEditAccount = () => {
        this.setState({
            isShowEditAccount: false,
        });
    }
    saveChangeUserName = () => {
        Meteor.call('changeUserName', this.newUserName.value, (err) => {
            if (err) {
                feedback.dealError(err);
                return;
            }
            feedback.dealSuccess('用户名修改成功');
        });
        this.setState({
            isShowEditAccountStep2: false,
        });
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
        const result = await Meteor.callPromise('sendRegisterSMS', username);
        this.setState({
            BizId: result.BizId,
        });
    }
    hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);
    changeUsername = async (e) => {
        e.preventDefault();
        const form = this.props.form;
        if (this.state.countDownNum <= 0 && this.state.countDownNum >= 60) {
            return feedback.dealWarning('请重新接受验证码');
        }
        form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
            if (!values.verificationCode) {
                return feedback.dealWarning('请输入验证码');
            }
            const queryResult = await Meteor.callPromise('queryDetail', values.username, this.state.BizId, Number(values.verificationCode));
            if (!queryResult) {
                return feedback.dealWarning('请输入正确的验证码');
            }
            Meteor.call('changeUserName', values.username, (error) => {
                if (error) {
                    return feedback.dealError(error);
                }
                feedback.dealSuccess('用户名修改成功');
            });
            this.setState({
                isShowEditAccount: false,
                isShowEditAccountStep2: false,
            });
        });
    }
    saveChangePassword = () => {
        if (this.$newPassword.value && this.$newRePassword.value && this.$oldPassword.value) {
            if (this.$newPassword.value !== this.$newRePassword.value) {
                return feedback.dealWarning('两次输入的密码不一致');
            }
            Accounts.changePassword(this.$oldPassword.value, this.$newPassword.value, (err) => {
                if (err) {
                    return feedback.dealError(err);
                }
                feedback.dealSuccess('密码修改成功');
            });
        } else {
            feedback.dealWarning('请输入密码');
        }
    }
    render() {
        const { username } = this.props.user;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const userNameError = isFieldTouched('username') && getFieldError('username');
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
            <div className="safe-setting">
                <div className="login-account">
                    <div className="login-account-edit">
                        <p className="login-title">登录账号</p>
                        <p>{username} &nbsp;
                            <button className="change-account" onClick={this.showEditAccount}>修改</button>
                        </p>
                    </div>
                    <div className="edit-login-tip">
                        修改后登录账号与您的信息都将变化
                    </div>
                </div>
                <ul>
                    <li>
                        <label htmlFor="editPassword">修改密码</label>
                    </li>
                    <li>
                        <label htmlFor="oldPassword">旧密码</label>
                        <input type="password" placeholder="请您输入旧密码" ref={i => this.$oldPassword = i} />
                    </li>
                    <li>
                        <label htmlFor="newPassword">新密码</label>
                        <input type="password" placeholder="请您输入新密码" ref={i => this.$newPassword = i} />
                    </li>
                    <li>
                        <label htmlFor="newPassword">确认密码</label>
                        <input type="password" placeholder="请您再次输入新密码" ref={i => this.$newRePassword = i} />
                    </li>
                    <li className="save-btn">
                        <button onClick={this.saveChangePassword}>保存</button>
                    </li>
                </ul>
                <ul>
                    <li>第三方登录</li>
                    <li className="bind-qq bind-other">
                        <p className="qq-logo">
                            <i className="iconfont icon-qq-copy" />
                        </p>
                        <p>QQ</p>
                        <p className="bind-btn">绑定</p>
                    </li>
                    <li className="bind-wechat bind-other">
                        <p className="wechat-logo">
                            <i className="iconfont icon-weixin" />
                        </p>
                        <p>微信</p>
                        <p className="bind-btn">解除绑定</p>
                    </li>
                </ul>
                {
                    this.state.isShowEditAccount ?
                        <Modal
                            title="修改登录账号"
                            visible
                            onCancel={this.closeEditAccount}
                            wrapClassName="create-team-mask"
                            footer={null}
                        >
                            <Form onSubmit={this.changeUsername} style={{ width: '85%' }}>
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
                                        <Input placeholder="请输入新手机号" />,
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
                                                <Input placeholder="短信验证码" />,
                                            )}
                                        </Col>
                                        <Col span={12}>
                                            {
                                                this.state.sendBtnStatus === 0 ?
                                                    <Button className="obtainCode" onClick={this.sendMessage}>获取验证码</Button>
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
                                    <Button disabled={this.hasErrors(getFieldsError())} type="primary" htmlType="submit" className="register-btn">完成</Button>
                                </FormItem>
                            </Form>
                        </Modal>
                        :
                        null
                }
            </div>
        );
    }
}


export default Form.create()(withTracker(() => ({
    user: Meteor.user() || {},
}))(SafeSetting));
