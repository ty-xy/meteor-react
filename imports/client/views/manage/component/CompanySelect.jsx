import React from 'react';
import { Select, Row } from 'antd';
import PropTypes from 'prop-types';

const Option = Select.Option;

const CompanySelect = ({ users, changeCompany, allCompanys }) => {
    const { profile } = users;
    const companys = [];
    ((profile && profile.company) || []).forEach((item) => {
        for (let i = 0; i < allCompanys.length; i++) {
            if (item === allCompanys[i]._id) {
                companys.push(allCompanys[i]);
                break;
            }
        }
    });
    const mainCompany = (users.profile && users.profile.mainCompany) || '暂无公司';
    return (
        <Row className="e-mg-left-link clearfix">
            <div className="e-mg-left-link-img"><img src="/start.jpg" width="40" /></div>
            <Select value={mainCompany} className="e-mg-left-company-select" onChange={changeCompany}>
                {companys.map(item => (<Option value={item._id} key={item._id}>{item.name}</Option>))}
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
