import React from 'react';
import { Input, Col, Form } from 'antd';
import PropTypes from 'prop-types';

const FormItem = Form.Item;

const InputType = ({ form, title, keyword, editData, required, requiredErr, marginBottom = 0 }) => (
    <Col span={24} style={{ marginBottom }}>
        <FormItem
            label={title}
        >
            {form.getFieldDecorator(keyword, {
                initialValue: editData && editData[keyword],
                rules: [{
                    required, message: requiredErr,
                }],
            })(
                <Input
                    className="e-mg-input-type"
                    size="large"
                    style={{ width: '98%' }}
                    placeholder="请输入文字"
                />,
            )}
        </FormItem>
    </Col>
);

InputType.propTypes = {
    title: PropTypes.string,
    keyword: PropTypes.string,
    form: PropTypes.object,
    editData: PropTypes.object,
    marginBottom: PropTypes.string,
    required: PropTypes.bool,
    requiredErr: PropTypes.string,
};
export default InputType;
