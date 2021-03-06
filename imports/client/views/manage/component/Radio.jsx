import React from 'react';
import { Switch, Col } from 'antd';
import PropTypes from 'prop-types';

const MyRadio = ({ form, title, keyword, editData = {}, subtitle = '', marginBottom = 0, handleSwitch }) => (
    <Col span={24} style={{ marginBottom }}>
        {title}： {form.getFieldDecorator(keyword)(
            <Switch defaultChecked={editData[keyword] || false} onChange={handleSwitch} className="e-mg-radio" />,
        )}
        {subtitle && <p style={{ color: '#bdbdbd', fontSize: '11px' }}>{subtitle}</p>}
    </Col>
);

MyRadio.propTypes = {
    title: PropTypes.string,
    keyword: PropTypes.string,
    form: PropTypes.object,
    editData: PropTypes.object,
    marginBottom: PropTypes.string,
    subtitle: PropTypes.string,
    handleSwitch: PropTypes.func,
};
export default MyRadio;
