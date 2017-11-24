import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'antd';

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
const InputReg = ({ keyword, label, required, defaultValue, placeholder, typeErr, requiredErr, width, form, onChange, disabled, regs = /([\w\W]*)/ }) => (
    <FormItem
        {...formItemLayout}
        label={label}
    >
        {form.getFieldDecorator(keyword, {
            initialValue: defaultValue,
            rules: [{
                message: typeErr, pattern: regs,
            }, {
                required, message: requiredErr,
            }],
        })(
            <Input disabled={disabled} placeholder={placeholder} onChange={onChange} style={{ width: width ? `${width}px` : '100%' }} />,
        )}
    </FormItem>
);

InputReg.propTypes = {
    onChange: PropTypes.func,
    form: PropTypes.object,
    keyword: PropTypes.string,
    typeErr: PropTypes.string,
    requiredErr: PropTypes.string,
    required: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    width: PropTypes.string,
    max: PropTypes.number,
    regs: PropTypes.any,
    disabled: PropTypes.bool,
};
export default InputReg;
