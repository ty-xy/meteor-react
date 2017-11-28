
import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import feedback from '../../../../util/feedback';
import UserUtil from '../../../../util/user';


const FormItem = Form.Item;
class DissolveTeam extends Component {
    static propTypes = {
        form: PropTypes.object,
        currentCompanyId: PropTypes.string,
    }
    constructor() {
        super();
        this.state = {
            formLayout: 'horizontal',
        };
    }
    handleSubmit = () => {
        console.log('解散团队', this.props.currentCompanyId);
        Meteor.call('deleteSubAdmin', this.props.currentCompanyId, (err) => {
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
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="company-main-manage-set company-set-arae">
                <div className="set-title">
                解散团队
                </div>
                <div className="main-manage-info">
                    <Form layout={formLayout} onSubmit={this.handleSubmit}>
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
                        <p className="dissolve-tip">
                        如果你的企业决定不再使用e建联，可以选择删除当前企业，删除后企业所有数据都将删除，并且无法撤销，请谨慎操作。
                        </p>
                        <FormItem {...buttonItemLayout}>
                            <Button type="primary" htmlType="submit">确认解散</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
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

