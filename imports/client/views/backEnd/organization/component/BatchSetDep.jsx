import React, { PureComponent } from 'react';
import { Button, Form } from 'antd';
import PropTypes from 'prop-types';

import MyModel from '../../../manage/audit/component/MyModel';
import Select from '../../../manage/audit/component/Select';


class BatchSetDep extends PureComponent {
    static propTypes = {
        modelShowHide: PropTypes.func,
        modelMember: PropTypes.bool,
        form: PropTypes.object,
        data: PropTypes.array,
        handleSubmitBatchDep: PropTypes.func,
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    // 新增人员提交
    handleCommentbtn = (e) => {
        e.preventDefault();
        const { form, handleSubmitBatchDep } = this.props;
        form.validateFields((err, fields) => {
            if (err) {
                return false;
            }
            handleSubmitBatchDep(fields);
        });
    }
    render() {
        const { modelMember, data, modelShowHide } = this.props;
        return (
            <MyModel
                handleCancel={() => modelShowHide(false, 'modelBatchDep')}
                show={modelMember}
                title="调整员工所属部门"
                animation="vertical"
                mask={modelMember}
                footer={<div />}
                height="210px"
            >
                <Form onSubmit={this.handleCommentbtn}>
                    <Select required userId keyword="dep" label="部门" placeholder="请选择部门" {...this.props} data={data} />
                    <div className="text-center form-buttom">
                        <Button type="primary" htmlType="submit">确定</Button>
                        <Button className="margin-left-20" onClick={() => modelShowHide(false, 'modelBatchDep')}>取消</Button>
                    </div>
                </Form>
            </MyModel>
        );
    }
}

export default Form.create()(BatchSetDep);

