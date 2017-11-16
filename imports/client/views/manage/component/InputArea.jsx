import React from 'react';
import { Input, Col, Form } from 'antd';
import PropTypes from 'prop-types';

const { TextArea } = Input;
const FormItem = Form.Item;

const InputArea = ({ form, title, keyword, defaultValue, className = '', marginBottom = 0, required, requiredErr, onChange, handleblur }) => {
    const focus = (e) => {
        e.preventDefault();
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };
    return (
        <Col span={24} style={{ marginBottom }}>
            <FormItem
                label={title}
            >
                {form.getFieldDecorator(keyword, {
                    initialValue: defaultValue,
                    rules: [{
                        required, message: requiredErr,
                    }],
                })(
                    <TextArea
                        onKeyUp={focus}
                        className={`e-mg-input-area ${className}`}
                        style={{ width: '98%' }}
                        placeholder="请输入文字"
                        onChange={e => onChange(e, keyword)}
                        onBlur={e => handleblur(e, keyword)}
                    />,
                )}
            </FormItem>
        </Col>
    );
};

InputArea.propTypes = {
    onChange: PropTypes.func,
    handleblur: PropTypes.func,
    title: PropTypes.string,
    keyword: PropTypes.string,
    form: PropTypes.object,
    marginBottom: PropTypes.string,
    className: PropTypes.string,
    required: PropTypes.bool,
    requiredErr: PropTypes.string,
    defaultValue: PropTypes.string,
};
export default InputArea;
