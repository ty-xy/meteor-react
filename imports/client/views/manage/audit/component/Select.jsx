import React from 'react';
import PropTypes from 'prop-types';
import { Select, Form } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
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
const MySelect = ({ keyword, label, required, defaultValue, onChange, placeholder, requiredErr, form, width, data = [] }) => (
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
            <Select allowClear onChange={onChange} placeholder={placeholder} style={{ width: width ? `${width}px` : '100%' }}>
                {
                    data.map(item => (<Option key={item} value={item}>{item}</Option>))
                }
            </Select>,
        )}
    </FormItem>
);
MySelect.propTypes = {
    form: PropTypes.object,
    keyword: PropTypes.string,
    requiredErr: PropTypes.string,
    required: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    width: PropTypes.string,
    data: PropTypes.array,
    onChange: PropTypes.func,
};
export default MySelect;
