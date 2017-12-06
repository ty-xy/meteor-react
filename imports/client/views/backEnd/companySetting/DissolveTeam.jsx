
import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import feedback from '../../../../util/feedback';
import UserUtil from '../../../../util/user';
import regexp from '../../../../util/regexp';


const FormItem = Form.Item;
class DissolveTeam extends Component {
    static propTypes = {
        form: PropTypes.object,
        currentCompanyId: PropTypes.string,
    }
    static contextTypes = {
        history: PropTypes.object,
    }
    constructor() {
        super();
        this.state = {
            formLayout: 'horizontal',
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
        const result = await Meteor.callPromise('sendRegisterSMS', username);
        this.setState({
            BizId: result.BizId,
        });
    }
    hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);
    handleRegister = async (e) => {
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
            console.log(values);
            const queryResult = await Meteor.callPromise('queryDetail', values.username, this.state.BizId, Number(values.verificationCode));
            if (!queryResult) {
                return feedback.dealWarning('请输入正确的验证码');
            }

            await Meteor.call('deleteCompany', this.props.currentCompanyId, (error) => {
                if (error) {
                    return feedback.dealError(error);
                }
                feedback.dealSuccess('解散团队成功');
            });
            this.context.history.push('/chat');
        });
    }
    handleSubmit = () => {
        this.context.history.push('/chat');
        Meteor.call('deleteCompany', this.props.currentCompanyId, (err) => {
            if (err) {
                console.error(err);
            }
            feedback.dealSuccess('解散团队成功');
        });
    }
    render() {
        const { formLayout } = this.state;
        const formItemLayout = formLayout === 'horizontal' ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        } : null;
        const buttonItemLayout = formLayout === 'horizontal' ? {
            wrapperCol: { span: 14, offset: 4 },
        } : null;
        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
        const userNameError = isFieldTouched('username') && getFieldError('username');
        const verificationCodeError = isFieldTouched('verificationCode') && getFieldError('verificationCode');
        return (
            <div className="company-main-manage-set company-set-arae">
                <div className="set-title">
                    解散团队
                </div>
                <div className="main-manage-info">
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
                        <p className="dissolve-tip">
                        如果你的企业决定不再使用e建联，可以选择删除当前企业，删除后企业所有数据都将删除，并且无法撤销，请谨慎操作。
                        </p>
                        <FormItem {...buttonItemLayout}>
                            <Button type="primary" htmlType="submit" disabled={this.hasErrors(getFieldsError())}>确认解散</Button>
                        </FormItem>
                    </Form>
                </div>
            </div >
        );
    }
}

export default Form.create({})(
    withTracker(() => {
        Meteor.subscribe('company');
        const currentCompanyId = UserUtil.getCurrentBackendCompany();
        return {
            currentCompanyId,
        };
    })(DissolveTeam),
);

