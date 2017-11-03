import React from 'react';
import { Button, Form } from 'antd';
import PropTypes from 'prop-types';
import InputArea from '../../component/InputArea';
import ImgUpload from '../../component/ImgUpload';
import FileUpload from '../../component/FileUpload';

class Day extends (React.PureComponent || React.Component) {
    constructor(props) {
        super(props);
        this.state = {
            // file: [],
            // img: [],
            // group: [],
        };
    }
    // componentWillReceiveProps() {
    //     console.log('componentWillReceiveProps');
    //     const { editData = {} } = this.props.editInfo;
    //     if (editData._id) {
    //         this.setState({ img: editData.img, file: editData.file });
    //     }
    // }
    formSubmit = (e) => {
        e.preventDefault();
        const { form, tab1Submit, logType } = this.props;
        const { img, file, group } = this.state;
        const fields = form.getFieldsValue();
        fields.type = logType;
        fields.file = file;
        fields.img = img;
        fields.peo = [];
        fields.group = group;
        tab1Submit(fields);
    }
    // 图片id返回
    changeUpdate = (name, imgs) => {
        // const img = [];
        // const file = [];
        console.log('changeUpdate', name, imgs);
        // const { img, file } = this.state;
        if (name === 'img') {
            this.setState({ img: imgs });
        }
        if (name === 'file') {
            this.setState({ file: imgs });
        }
    }
    // 删除图片
    removeUpload = (imgs, keyword) => {
        this.setState({ [keyword]: imgs });
    }
    render() {
        const { editInfo } = this.props;
        const { img, file } = editInfo;
        console.log('props', this.props);
        return (
            <Form onSubmit={this.formSubmit} style={{ height: '100%' }}>
                <InputArea title="今日工作总结：" keyword="finish" {...this.props} />
                <InputArea title="明日工作计划：" keyword="plan" {...this.props} />
                <InputArea title="需要协调与帮助：" keyword="help" marginBottom="20px" {...this.props} />
                <ImgUpload title="添加图片：（支持.jpg, .jpeg, .bmp, .gif, .png类型文件， 5M以内）" keyword="img" fileList={img || []} changeUpdate={this.changeUpdate} removeUpload={this.removeUpload} {...this.props} />
                <FileUpload title="添加附件：（支持.doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip, .rar类型文件， 5M以内）" keyword="file" fileList={file || []} removeUpload={this.removeUpload} changeUpdate={this.changeUpdate} {...this.props} />
                <Button htmlType="submit">提交</Button>
            </Form>
        );
    }
}
Day.propTypes = {
    tab1Submit: PropTypes.func,
    form: PropTypes.object,
    logType: PropTypes.string,
};
export default Form.create()(Day);
