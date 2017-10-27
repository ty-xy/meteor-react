import React from 'react';
import { Button, Form } from 'antd';
import PropTypes from 'prop-types';
import InputArea from '../../component/InputArea';
import ImgUpload from '../../component/ImgUpload';

class Week extends (React.PureComponent || React.Component) {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    formSubmit = (e) => {
        e.preventDefault();
        const { form, tab1Submit, logType } = this.props;
        const fields = form.getFieldsValue();
        fields.type = logType;
        fields.file = [];
        fields.img = [];
        fields.peo = [];
        fields.group = [];
        tab1Submit(fields);
    }
    render() {
        return (
            <Form onSubmit={this.formSubmit} style={{ height: '100%' }}>
                <InputArea title="本周工作总结：" keyword="finish" {...this.props} />
                <InputArea title="下周工作计划：" keyword="plan" {...this.props} />
                <InputArea title="需要协调与帮助：" keyword="help" marginBottom="20px" {...this.props} />
                <ImgUpload title="添加图片：（支持.jpg, .jpeg, .bmp, .gif, .png类型文件， 5M以内）" keyword="img" {...this.props} />
                <ImgUpload title="添加附件：（支持.doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip, .rar类型文件， 5M以内）" keyword="file" {...this.props} />
                <Button htmlType="submit">提交</Button>
            </Form>
        );
    }
}
Week.propTypes = {
    tab1Submit: PropTypes.func,
    form: PropTypes.object,
    logType: PropTypes.string,
};
export default Form.create()(Week);
