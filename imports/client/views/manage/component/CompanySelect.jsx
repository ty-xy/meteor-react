import React from 'react';
import { Select, Row } from 'antd';
import PropTypes from 'prop-types';

const Option = Select.Option;

const CompanySelect = ({ companys, onChange }) => (
    <Row className="e-mg-text-center e-mg-left-link">
        <Select defaultValue={(companys.length && companys[0].name) || '暂无可选'} className="e-mg-left-company" onChange={onChange}>
            {companys.map(item => (<Option value={`${item.id}`} key={item.id}>{item.name}</Option>))}
        </Select>
    </Row>
);
CompanySelect.propTypes = {
    companys: PropTypes.array,
    onChange: PropTypes.func,
};

export default CompanySelect;
