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
const MyInput = ({ keyword, label, type, required, defaultValue, placeholder, typeErr, requiredErr, width, form, max, disabled, onChange }) => (
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
            type === 'number' ? (<InputNumber onChange={onChange} max={max} min={0} placeholder={placeholder} style={{ width: width ? `${width}px` : '100%' }} />)
                : (<Input disabled={disabled} placeholder={placeholder} onChange={onChange} style={{ width: width ? `${width}px` : '100%' }} />),
        )}
    </FormItem>
);
MyInput.propTypes = {
    onChange: PropTypes.func,
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
    disabled: PropTypes.bool,
};
export default MyInput;
