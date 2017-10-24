import React from 'react';
import { Select, Row } from 'antd';
import PropTypes from 'prop-types';

const Option = Select.Option;

const CompanySelect = ({ users, changeCompany }) => {
    const { profile } = users;
    const companys = (profile && profile.company) || [];
    let defaultValue = '暂无公司';
    companys.forEach((item) => {
        if (item.selected) {
            defaultValue = item.id;
        }
    });
    return (
        <Row className="e-mg-text-center e-mg-left-link">
            <Select defaultValue={defaultValue} className="e-mg-left-company" onChange={changeCompany}>
                {companys.map((item, index) => (<Option value={item.id} key={index}>{item.name}</Option>))}
            </Select>
        </Row>
    );
};
CompanySelect.propTypes = {
    users: PropTypes.object,
    changeCompany: PropTypes.func,
};

export default CompanySelect;
