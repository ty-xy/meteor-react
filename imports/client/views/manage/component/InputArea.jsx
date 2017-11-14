import React from 'react';
import { Input, Col } from 'antd';
import PropTypes from 'prop-types';

const { TextArea } = Input;

const InputArea = ({ form, title, keyword, editData, className = '', marginBottom = 0, required, requiredErr }) => {
    const focus = (e) => {
        e.preventDefault();
        e.target.style.height = `${e.target.scrollHeight}px`;
    };
    const blur = (e) => {
        e.preventDefault();
        console.log('e.preventDefault();', e.target.value.replace(/\r\n/g, '&nbsp;'));
    };
    return (
        <Col span={24} style={{ marginBottom }}>
            {title && <p className="e-mg-input-label">{title}</p>}
            {form.getFieldDecorator(keyword, {
                initialValue: editData && editData[keyword],
                rules: [{
                    required, message: requiredErr,
                }],
            })(
                <TextArea
                    onKeyUp={focus}
                    onBlur={blur}
                    className={`e-mg-input-area ${className}`}
                    style={{ width: '98%' }}
                    placeholder="请输入文字"
                />,
            )}
        </Col>
    );
};

InputArea.propTypes = {
    title: PropTypes.string,
    keyword: PropTypes.string,
    form: PropTypes.object,
    editData: PropTypes.object,
    marginBottom: PropTypes.string,
    className: PropTypes.string,
    required: PropTypes.bool,
    requiredErr: PropTypes.string,
};
export default InputArea;
