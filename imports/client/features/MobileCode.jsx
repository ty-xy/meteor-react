import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, Input, Button, Row, Col } from 'antd';

const FormItem = Form.Item;
class MobileCode extends Component {
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
            <div>
                <Form layout={formLayout} onSubmit={this.handleSubmit}>
                    <FormItem
                        label="手机号"
                        {...formItemLayout}
                    >
                        <Row gutter={8}>
                            <Col span={12}>
                                {getFieldDecorator('captcha', {
                                    rules: [{ required: true, message: 'Please input the captcha you got!' }],
                                })(
                                    <Input placeholder="输入手机号" />,
                                )}
                            </Col>
                            <Col span={12}>
                                <Button size="large">获取验证码</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem
                        label="验证码"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('name', {
                            rules: [{
                                type: 'string', message: '类型为string!',
                            }, {
                                required: true, message: '商品名称!',
                            }],
                        })(
                            <Input placeholder="验证码" />,
                        )}
                    </FormItem>
                    <FormItem {...buttonItemLayout}>
                        <Button type="primary" htmlType="submit">创建</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create({})(MobileCode);
