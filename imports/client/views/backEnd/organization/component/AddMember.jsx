import React, { PureComponent } from 'react';
import { Button, Form } from 'antd';
// import classnames from 'classnames';
import PropTypes from 'prop-types';

import MyModel from '../../../manage/audit/component/MyModel';
import MyInput from '../../../manage/audit/component/Input';
import Select from '../../../manage/audit/component/Select';


class AddMembers extends PureComponent {
    static propTypes = {
        modelShowHide: PropTypes.func,
        postAddMembers: PropTypes.func,
        modelMember: PropTypes.bool,
        form: PropTypes.object,
        data: PropTypes.array,
        handleSubmitMember: PropTypes.func,
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    // 取消
    handleCancel = () => {
        this.props.form.resetFields();
        this.props.modelShowHide(false, 'modelMember');
    }
    handleInput = (e, name) => {
        if (name === 'checkout') {
            this.setState({ isAutoChat: e.target.checked });
        } else {
            this.setState({ name: e.target.value, require: false });
        }
    }
    // 新增人员提交
    handleCommentbtn = (e) => {
        e.preventDefault();
        const { form, handleSubmitMember } = this.props;
        form.validateFields((err, fields) => {
            if (err) {
                return false;
            }
            handleSubmitMember(fields);
        });
    }

    render() {
        // const {  } = this.state;
        const { modelMember, data } = this.props;
        const deps = data.map(item => (item.name));
        const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        return (
            <MyModel
                handleCancel={this.handleCancel}
                show={modelMember}
                title="新增员工"
                animation="vertical"
                mask={modelMember}
                footer={<div />}
                height="370px"
            >
                <Form onSubmit={this.handleCommentbtn}>
                    <MyInput keyword="name" required label="姓名" placeholder="请输入姓名" {...this.props} requiredErr="姓名必填" />
                    <MyInput keyword="phone" required label="手机" placeholder="请输入手机" {...this.props} reg={reg} typeErr="请填写正确的手机号" requiredErr="手机号必填" />
                    <Select keyword="dep" label="部门" placeholder="请选择部门" {...this.props} data={deps} />
                    <MyInput keyword="pos" label="职务" placeholder="请输入职务" {...this.props} />
                    <div className="text-center form-buttom">
                        <Button type="primary" htmlType="submit">确定</Button>
                        <Button className="margin-left-20" onClick={this.handleCancel}>取消</Button>
                    </div>
                </Form>
            </MyModel>
        );
    }
}

export default Form.create()(AddMembers);
