import React from 'react';
import PropTypes from 'prop-types';
import { Col, Button } from 'antd';

const SubmitBtn = ({ offset, history }) => (
    <Col offset={offset || 6}>
        <Button type="primary" size="large" htmlType="submit">提交</Button>
        <Button size="large" className="margin-left-20" onClick={() => history.push({ pathname: '/manage/audit' })}>取消</Button>
    </Col>
);
SubmitBtn.propTypes = {
    offset: PropTypes.number,
    history: PropTypes.object,
};
export default SubmitBtn;
