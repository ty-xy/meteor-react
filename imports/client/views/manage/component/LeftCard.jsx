import React from 'react';
import { Row, Col, Card } from 'antd';
import PropTypes from 'prop-types';
import Category from './Category';
import CompanySelect from './CompanySelect';


const LeftCard = props => (
    <Col span={6} className="e-mg-left">
        <Card bordered={false}>
            <CompanySelect {...props} />
            <Row><Category {...props} /></Row>
        </Card>
    </Col>
);

LeftCard.propTypes = {
    changeTag: PropTypes.func,
    companys: PropTypes.array,
    changeCompany: PropTypes.func,
};

export default LeftCard;
