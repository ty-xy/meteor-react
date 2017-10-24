import React from 'react';
import { Select, Row } from 'antd';
import PropTypes from 'prop-types';

const Option = Select.Option;

const CompanySelect = ({ companys, onChange }) => (
    <Row className="e-mg-text-center e-mg-left-link">
        <Select defaultValue={(companys.length && companys[0].id) || '暂无公司'} className="e-mg-left-company" onChange={onChange}>
            {companys.map((item, index) => (<Option value={item.id} key={index}>{item.name}</Option>))}
        </Select>
    </Row>
);
CompanySelect.propTypes = {
    companys: PropTypes.array,
    onChange: PropTypes.func,
    // users: PropTypes.object,
};

export default CompanySelect;
