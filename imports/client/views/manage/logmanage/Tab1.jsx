import React from 'react';
import { Button, Form } from 'antd';
import PropTypes from 'prop-types';
import InputArea from '../component/InputArea';

class Tab1 extends (React.PureComponent || React.Component) {
    tabsubmit = (e) => {
        e.preventDefault();
        const { form, tab1Submit } = this.props;
        tab1Submit(form.getFieldsValue());
    }
    render() {
        return (
            <Form onSubmit={this.tabsubmit}>
                <InputArea title="本周工作总结" keyword="finish" {...this.props} />
                <InputArea title="下周工作计划" keyword="plan" {...this.props} />
                <InputArea title="需要协调与帮助" keyword="help" {...this.props} />
                <Button htmlType="submit">提交</Button>
            </Form>
        );
    }
}

Tab1.propTypes = {
    tab1Submit: PropTypes.func,
    form: PropTypes.object,
};
export default Form.create()(Tab1);
