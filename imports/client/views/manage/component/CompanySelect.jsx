import React from 'react';
import { Select, Row } from 'antd';
import PropTypes from 'prop-types';

const Option = Select.Option;

const CompanySelect = ({ users, allCompanys, changeCompany }) => {
    const { profile } = users;
    const companys = (profile && profile.company) || [];
    const belongCompanys = [];
    companys.forEach((i) => {
        allCompanys.forEach((j) => {
            if (j._id === i) {
                belongCompanys.push(j);
            }
        });
    });
    const mainCompany = (users.profile && users.profile.mainCompany) || '暂无公司';
    return (
        <Row className="e-mg-text-center e-mg-left-link">
            <Select value={mainCompany} className="e-mg-left-company" onChange={changeCompany}>
                {belongCompanys.map(item => (<Option value={item._id} key={item._id}>{item.name}</Option>))}
            </Select>
        </Row>
    );
};
CompanySelect.propTypes = {
    users: PropTypes.object,
    changeCompany: PropTypes.func,
    allCompanys: PropTypes.array,
};

export default CompanySelect;
