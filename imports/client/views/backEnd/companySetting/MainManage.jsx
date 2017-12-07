import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Modal } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Avatar from '../../../components/Avatar';
import feedback from '../../../../util/feedback';
import UserUtil from '../../../../util/user';
import Company from '../../../../schema/company';
import fields from '../../../../util/fields';
import SelectOne from '../../../features/SelectOne';
import regexp from '../../../../util/regexp';


const FormItem = Form.Item;
class MainManage extends Component {
    static propTypes = {
        form: PropTypes.object,
        currentCompany: PropTypes.object,
        teamMemberIds: PropTypes.array,
    }
    constructor() {
        super();
        this.state = {
            formLayout: 'horizontal',
            visible: false,
            countDownNum: 60,
            sendBtnStatus: 0,
            BizId: '',
            newAdminId: '',
        };
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
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
            const companyId = this.props.currentCompany._id;
            const oldAdminId = this.props.currentCompany.admin;
            Meteor.call('changeMainManage', companyId, oldAdminId, this.state.newAdminId, (error) => {
                if (error) {
                    console.error(error.reason);
                }
                feedback.dealSuccess('设置成功');
            });
        });
    }
    confirmChange = (newAdminId) => {
        this.handleCancel();
        this.setState({
            newAdminId,
        });
        // Meteor.call('changeMainManage', companyId, oldAdminId, newAdminId, (err) => {
        //     if (err) {
        //         console.error(err.reason);
        //     }
        //     feedback.dealSuccess('设置成功');
        //     this.handleCancel();
        // });
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
        const { adminInfo = {} } = this.props.currentCompany;
        return (
            <div className="company-main-manage-set company-set-arae">
                <div className="set-title">
                主管理员
                </div>
                <div className="main-manage-info">
                    <Form layout={formLayout} onSubmit={this.handleRegister}>
                        <FormItem
                            label="主管理员"
                            {...formItemLayout}
                        >
                            {
                                adminInfo && adminInfo.name ?
                                    <div className="upload-team-avatar">
                                        <Avatar avatar={adminInfo && adminInfo.avatar} name={adminInfo && adminInfo.name} avatarColor={adminInfo && adminInfo.avatarColor} />
                                        <p className="edit-avatar" onClick={this.showModal}>更改</p>
                                    </div>
                                    :
                                    null
                            }

                        </FormItem>

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
                        <FormItem {...buttonItemLayout}>
                            <Button type="primary" htmlType="submit" disabled={this.hasErrors(getFieldsError())}>保存</Button>
                        </FormItem>
                    </Form>
                </div>
                <Modal
                    title="选择主管理员"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    wrapClassName="create-team-mask"
                    footer={null}
                    width={400}
                >
                    <SelectOne
                        teamMemberIds={this.props.teamMemberIds}
                        confirmChange={this.confirmChange}
                    />
                </Modal>
            </div>
        );
    }
}

export default Form.create({})(
    withTracker(() => {
        Meteor.subscribe('company');
        Meteor.subscribe('users');
        const currentCompanyId = UserUtil.getCurrentBackendCompany();
        const currentCompany = Company.findOne({ _id: currentCompanyId });
        const currentAdmin = Meteor.users.findOne({ _id: currentCompany.admin }, { fields: fields.searchAllUser });
        currentCompany.adminInfo = currentAdmin ? currentAdmin.profile : {};
        const members = [];
        for (const value of Object.values(currentCompany.members)) {
            members.push(value.userId);
        }

        return {
            currentCompany,
            teamMemberIds: members,
        };
    })(MainManage),
);
