import React from 'react';
import { Input, Col } from 'antd';
import PropTypes from 'prop-types';

const { TextArea } = Input;

const InputArea = ({ form, title, keyword }) => {
    const focus = (e) => {
        e.preventDefault();
        e.target.style.height = `${e.target.scrollHeight}px`;
    };
    return (
        <Col span={24}>
            {title && <p className="e-mg-input-label">{title}</p>}
            {form.getFieldDecorator(keyword)(
                <TextArea
                    row={4}
                    onKeyUp={focus}
                    className="e-mg-input-area"
                    style={{ width: '98%' }}
                />,
            )}
        </Col>
    );
};

InputArea.propTypes = {
    title: PropTypes.string,
    keyword: PropTypes.string,
    form: PropTypes.object,
};
export default InputArea;
