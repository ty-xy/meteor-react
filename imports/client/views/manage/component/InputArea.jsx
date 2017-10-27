import React from 'react';
import { Input, Col } from 'antd';
import PropTypes from 'prop-types';

const { TextArea } = Input;

const InputArea = ({ form, title, keyword, editData, marginBottom = 0 }) => {
    const focus = (e) => {
        e.preventDefault();
        e.target.style.height = `${e.target.scrollHeight}px`;
    };
    return (
        <Col span={24} style={{ marginBottom }}>
            {title && <p className="e-mg-input-label">{title}</p>}
            {form.getFieldDecorator(keyword, {
                initialValue: editData[keyword],
            })(
                <TextArea
                    onKeyUp={focus}
                    className="e-mg-input-area"
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
};
export default InputArea;
