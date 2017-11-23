import React, { PureComponent } from 'react';
import { Button, Form } from 'antd';
// import classnames from 'classnames';
import PropTypes from 'prop-types';

import MyModel from '../../../manage/audit/component/MyModel';
import MyInput from '../../../manage/audit/component/Input';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

class AddMembers extends PureComponent {
    static propTypes = {
        modelShowHide: PropTypes.func,
        postAddMembers: PropTypes.func,
        modelMember: PropTypes.bool,
        form: PropTypes.object,
        data: PropTypes.object,
        handleSubmitMember: PropTypes.func,
        handleDepDel: PropTypes.func,
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    // 取消
    handleCancel = () => {
        this.props.form.resetFields();
        this.props.modelShowHide(false, 'settingModel');
    }
    handleInput = (e, name) => {
        if (name === 'checkout') {
            this.setState({ isAutoChat: e.target.checked });
        } else {
            this.setState({ name: e.target.value, require: false });
        }
    }
    // 编辑部门
    handleDepSetting = (e) => {
        e.preventDefault();
        const { form, handleSubmitMember, data } = this.props;
        form.validateFields((err, fields) => {
            if (err) {
                return false;
            }
            handleSubmitMember(fields, data.name);
        });
    }

    render() {
        // const {  } = this.state;
        const { modelMember, data, handleDepDel } = this.props;
        return (
            <MyModel
                handleCancel={this.handleCancel}
                show={modelMember}
                title="设置"
                animation="vertical"
                mask={modelMember}
                footer={<div />}
                height="325px"
            >
                <Form onSubmit={this.handleDepSetting}>
                    <MyInput keyword="name" defaultValue={data.name} required label="姓名" placeholder="请输入姓名" {...this.props} requiredErr="姓名必填" />
                    <FormItem
                        {...formItemLayout}
                        label="人数"
                    >
                        {data.num || 0}
                    </FormItem>
                    <div className="text-center form-buttom">
                        <div><Button className="margin-top-20" style={{ width: '150px' }} type="primary" htmlType="submit">保存</Button></div>
                        <div className="margin-top-20"><Button type="danger" style={{ width: '150px', background: '#EF5350', color: '#fff', borderColor: '#EF5350' }} onClick={() => handleDepDel(data.name)}>删除</Button></div>
                    </div>
                </Form>
            </MyModel>
        );
    }
}

export default Form.create()(AddMembers);
