import React from 'react';
import PropTypes from 'prop-types';
import { Col, Button } from 'antd';

const SubmitBtn = ({ offset }) => (
    <Col offset={offset || 6}>
        <Button type="primary" size="large" htmlType="submit">提交</Button>
        <Button size="large" className="margin-left-20">取消</Button>
    </Col>
);
SubmitBtn.propTypes = {
    offset: PropTypes.number,
};
export default SubmitBtn;
