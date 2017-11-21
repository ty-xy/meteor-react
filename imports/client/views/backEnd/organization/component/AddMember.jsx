import React, { PureComponent } from 'react';
import { Button, Form } from 'antd';
// import classnames from 'classnames';
import PropTypes from 'prop-types';

import MyModel from '../../../manage/audit/component/MyModel';
import MyInput from '../../../manage/audit/component/Input';


class AddMembers extends PureComponent {
    static propTypes = {
        modelShowHide: PropTypes.func,
        postAddMembers: PropTypes.func,
        modelMember: PropTypes.bool,
        form: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    // 取消
    handleCancel = () => {
        this.setState({ isAutoChat: false, name: '', required: false }, () => {
            this.props.modelShowHide(false, 'modelMember');
        });
    }
    handleInput = (e, name) => {
        if (name === 'checkout') {
            this.setState({ isAutoChat: e.target.checked });
        } else {
            this.setState({ name: e.target.value, require: false });
        }
    }
    // 新增部门提交
    handleCommentbtn = (e) => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, fields) => {
            if (err) {
                return false;
            }
            console.log(fields);
        });
    }

    render() {
        // const {  } = this.state;
        const { modelMember } = this.props;
        console.log('addmember', this.props, this.state);
        const footer = (
            <div className="e-mg-model-footer">
                <div className="text-center">
                    <Button type="primary" htmlType="submit">确定</Button>
                    <Button className="margin-left-20" onClick={this.handleCancel}>取消</Button>
                </div>
            </div>
        );
        return (
            <MyModel
                handleCancel={this.handleCancel}
                show={modelMember}
                title="新增员工"
                animation="vertical"
                mask={modelMember}
                footer={footer}
            >
                <Form className="clearfix e-mg-model-comment" onSubmit={this.handleCommentbtn}>
                    <MyInput keyword="name" required label="姓名" placeholder="请输入姓名" {...this.props} />
                    <MyInput keyword="phone" required label="手机" placeholder="请输入手机" {...this.props} type="number" />
                    <MyInput keyword="pos" required label="职务" placeholder="请输入职务" {...this.props} />
                </Form>
            </MyModel>
        );
    }
}

export default Form.create()(AddMembers);
