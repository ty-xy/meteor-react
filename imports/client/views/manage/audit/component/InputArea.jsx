import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form } from 'antd';

const { TextArea } = Input;
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
const focus = (e) => {
    e.preventDefault();
    e.target.style.height = `${e.target.scrollHeight}px`;
};

const MyInput = ({ keyword, label, required, defaultValue, placeholder, requiredErr, width = '100%', form }) => (
    <FormItem
        {...formItemLayout}
        label={label}
    >
        {form.getFieldDecorator(keyword, {
            initialValue: defaultValue,
            rules: [{
                required, message: requiredErr,
            }],
        })(
            <TextArea onFocus={focus} placeholder={placeholder} style={{ width, minHeight: '80px' }} />,
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
