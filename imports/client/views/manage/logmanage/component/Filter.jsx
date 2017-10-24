import React from 'react';
import { DatePicker, Select } from 'antd';
import PropTypes from 'prop-types';

const Option = Select.Option;
const { RangePicker } = DatePicker;

const MySelect = ({ data, title, keyword, width, handleChange, handleFocus }) => (
    <span data-info={data}>
        {title}：
        <Select
            showSearch
            style={{ width: (width || 200) }}
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={val => handleChange(val, keyword)}
            onFocus={handleFocus}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="tom">Tom</Option>
        </Select>
    </span>
);
const MyDatepicker = ({ handleChange, keyword, title }) => (
    <span>
        {title}：
        <RangePicker
            format="YYYY-MM-DD"
            placeholder={['Start Time', 'End Time']}
            onChange={(date, dateString) => handleChange(dateString, keyword)}
        />
    </span>
);

MySelect.propTypes = {
    data: PropTypes.array,
    handleFocus: PropTypes.func,
    handleChange: PropTypes.func,
    width: PropTypes.number,
    title: PropTypes.string,
    keyword: PropTypes.string,
};
MyDatepicker.propTypes = {
    handleChange: PropTypes.func,
    keyword: PropTypes.string,
    title: PropTypes.string,
};

const wrap = props => WrapComponent =>
    <WrapComponent {...props} />;

const filter = {
    mySelect: props => wrap(props)(MySelect),
    myDate: props => wrap(props)(MyDatepicker),
};
export default filter;
