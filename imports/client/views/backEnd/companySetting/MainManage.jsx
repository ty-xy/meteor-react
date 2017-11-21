import React, { Component } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import PropTypes from 'prop-types';

import Avatar from '../../../components/Avatar';

const FormItem = Form.Item;
class MainManage extends Component {
    static propTypes = {
        form: PropTypes.object,
    }
    constructor() {
        super();
        this.state = {
            formLayout: 'horizontal',
        };
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
                主管理员
                </div>
                <div className="main-manage-info">
                    <Form layout={formLayout} onSubmit={this.handleSubmit}>
                        <FormItem
                            label="主管理员"
                            {...formItemLayout}
                        >
                            <div className="upload-team-avatar">
                                <Avatar avatar="http://oxldjnom8.bkt.clouddn.com/groupAvatar.png" name="团队" />
                                <p className="edit-avatar">更改
                                    <input type="file" id="avatar" onChange={this.handleUploadImg} />
                                </p>
                            </div>
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
            </div>
        );
    }
}

export default Form.create({})(MainManage);
