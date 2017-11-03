import React from 'react';
import { Input, Col } from 'antd';
import PropTypes from 'prop-types';

const InputType = ({ form, title, keyword, editData, marginBottom = 0 }) => (
    <Col span={24} style={{ marginBottom }}>
        {title && <p className="e-mg-input-label">{title}</p>}
        {form.getFieldDecorator(keyword, {
            initialValue: editData && editData[keyword],
        })(
            <Input
                className="e-mg-input-type"
                size="large"
                style={{ width: '98%' }}
                placeholder="请输入文字"
            />,
        )}
    </Col>
);

InputType.propTypes = {
    title: PropTypes.string,
    keyword: PropTypes.string,
    form: PropTypes.object,
    editData: PropTypes.object,
    marginBottom: PropTypes.string,
};
export default InputType;
