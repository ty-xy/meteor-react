import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Modal } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Avatar from '../../../components/Avatar';
import SelectMembers from '../../../features/SelectMembers';
import feedback from '../../../../util/feedback';
import UserUtil from '../../../../util/user';
import Company from '../../../../schema/company';
import fields from '../../../../util/fields';


const FormItem = Form.Item;
class MainManage extends Component {
    static propTypes = {
        form: PropTypes.object,
        currentCompany: PropTypes.object,
        team: PropTypes.array,
    }
    constructor() {
        super();
        this.state = {
            formLayout: 'horizontal',
            visible: false,
        };
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    confirmChange = (selectedId) => {
        const companyId = this.props.currentCompany._id;
        Meteor.call('changeMainManage', companyId, selectedId[0], (err) => {
            if (err) {
                console.error(err.reason);
            }
            feedback.dealSuccess('设置成功');
            this.handleCancel();
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
        const { getFieldDecorator } = this.props.form;
        const { adminInfo = {} } = this.props.currentCompany;
        return (
            <div className="company-main-manage-set company-set-arae">
                <div className="set-title">
                主管理员
                </div>
                <div className="main-manage-info">
                    <Form layout={formLayout} onSubmit={this.handleSubmit}>
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
                            label="手机号"
                            {...formItemLayout}
                        >
                            <Row gutter={8}>
                                <Col span={12}>
                                    {getFieldDecorator('captcha', {
                                        rules: [
                                            { type: 'number', message: '类型为number!' },
                                            { required: true, message: '请输入正确的手机号!' },
                                        ],
                                    })(
                                        <Input placeholder="输入手机号" size="large" />,
                                    )}
                                </Col>
                                <Col span={12}>
                                    <Button size="large" type="primary">获取验证码</Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem
                            label="验证码"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('name', {
                                rules: [{
                                    type: 'number', message: '类型为number!',
                                }, {
                                    required: true, message: '验证码!',
                                }],
                            })(
                                <Input placeholder="验证码" />,
                            )}
                        </FormItem>
                        <FormItem {...buttonItemLayout}>
                            <Button type="primary" htmlType="submit">保存</Button>
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
                >
                    <SelectMembers
                        team={this.props.team}
                        confirmSelected={this.confirmChange}
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
        const team = [
            {
                name: currentCompany.name,
                members,
            },
        ];
        return {
            currentCompany,
            team,
        };
    })(MainManage),
);
