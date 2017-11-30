import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Form } from 'antd';
import format from 'date-format';

const RangePicker = DatePicker.RangePicker;
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
const MyDate = ({ keyword, label, required, defaultValue, placeholder, requiredErr, form, width, onChange, disabledDate, k }) => (
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
            <RangePicker allowClear format={formatDate} disabledDate={disabledDate} onChange={(date, dateString) => onChange(date, dateString, k)} placeholder={placeholder} style={{ width: width ? `${width}px` : '100%' }} />,
        )}
    </FormItem>
);
MyDate.propTypes = {
    k: PropTypes.number,
    form: PropTypes.object,
    keyword: PropTypes.string,
    requiredErr: PropTypes.string,
    required: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.array,
    defaultValue: PropTypes.string,
    width: PropTypes.string,
    onChange: PropTypes.func,
    disabledDate: PropTypes.func,
};
export default MyDate;
