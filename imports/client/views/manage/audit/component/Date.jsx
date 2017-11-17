import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Form } from 'antd';
import format from 'date-format';

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
const formatDate = 'YYYY-MM-DD';
const MyDate = ({ keyword, label, required, defaultValue, placeholder, requiredErr, form, width, disabledDate }) => (
    <FormItem
        {...formItemLayout}
        label={label}
    >
        {form.getFieldDecorator(keyword, {
            initialValue: (defaultValue && format(defaultValue)) || null,
            rules: [{
                required, message: requiredErr,
            }],
        })(
            <DatePicker allowClear format={formatDate} placeholder={placeholder} disabledDate={disabledDate} style={{ width: width ? `${width}px` : '100%' }} />,
        )}
    </FormItem>
);
MyDate.propTypes = {
    form: PropTypes.object,
    keyword: PropTypes.string,
    requiredErr: PropTypes.string,
    required: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    width: PropTypes.string,
    disabledDate: PropTypes.func,
};
export default MyDate;
