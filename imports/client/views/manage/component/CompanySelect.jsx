import React from 'react';
import { Select, Row } from 'antd';
import PropTypes from 'prop-types';

const Option = Select.Option;

const CompanySelect = ({ users, changeCompany }) => {
    const { profile } = users;
    const companys = (profile && profile.company) || [];
    // console.log('allCompanys', allCompanys, companys);
    const mainCompany = (users.profile && users.profile.mainCompany) || '暂无公司';
    return (
        <Row className="e-mg-text-center e-mg-left-link">
            <Select value={mainCompany} className="e-mg-left-company" onChange={changeCompany}>
                {companys.map(item => (<Option value={item.id} key={item.id}>{item.name}</Option>))}
            </Select>
        </Row>
    );
};
CompanySelect.propTypes = {
    users: PropTypes.object,
    changeCompany: PropTypes.func,
};

export default CompanySelect;
