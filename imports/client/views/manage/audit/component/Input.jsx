import React from 'react';
import PropTypes from 'prop-types';
import { Input, InputNumber, Form } from 'antd';

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
const MyInput = ({ keyword, label, type, required, defaultValue, placeholder, typeErr, requiredErr, width, form, max }) => (
    <FormItem
        {...formItemLayout}
        label={label}
    >
        {form.getFieldDecorator(keyword, {
            initialValue: defaultValue,
            rules: [{
                type: type || 'string', message: typeErr,
            }, {
                required, message: requiredErr,
            }],
        })(
            type === 'number' ? (<InputNumber max={max} placeholder={placeholder} style={{ width: width ? `${width}px` : '100%' }} />)
                : (<Input placeholder={placeholder} style={{ width: width ? `${width}px` : '100%' }} />),
        )}
    </FormItem>
);
MyInput.propTypes = {
    form: PropTypes.object,
    keyword: PropTypes.string,
    type: PropTypes.string,
    typeErr: PropTypes.string,
    requiredErr: PropTypes.string,
    required: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    width: PropTypes.string,
    max: PropTypes.number,
};
export default MyInput;
