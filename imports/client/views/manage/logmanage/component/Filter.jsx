import React from 'react';
import { DatePicker, Select } from 'antd';
import PropTypes from 'prop-types';

const Option = Select.Option;
const { RangePicker } = DatePicker;

const MySelect = ({ title, data, keyword, width, handleChange }) => (
    <span>
        {title}：
        <Select
            showSearch
            allowClear
            style={{ width: (width || 200) }}
            placeholder="请选择模板"
            optionFilterProp="children"
            onChange={val => handleChange(val, keyword)}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
            {
                data.map((item, index) => <Option key={index} value={item.name || item.username}>{item.value || item.profile.name}</Option>)
            }
        </Select>
    </span>
);
const MyDatepicker = ({ handleChange, keyword, title }) => (
    <span>
        {title}：
        <RangePicker
            format="YYYY-MM-DD"
            placeholder={['开始时间', '结束时间']}
            onChange={(date, dateString) => handleChange(dateString, keyword)}
        />
    </span>
);

MySelect.propTypes = {
    handleChange: PropTypes.func,
    width: PropTypes.number,
    data: PropTypes.array,
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
