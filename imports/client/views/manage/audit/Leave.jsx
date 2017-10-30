import React, { Component } from 'react';
// import { Route, Link } from 'react-router-dom';
import { Form } from 'antd';
import PropTypes from 'prop-types';
// import format from 'date-format';
import Goback from './component/Goback';
import MyInput from './component/Input';
import MySelect from './component/Select';
import MyDatePicker from './component/Date';
import MyTextArea from './component/InputArea';
import ImgUpload from '../component/ImgUpload';
import SubmitBtn from './component/SubmitBtn';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};
const types = ['事假', '病假', '年假', '调休', '婚假', '产假', '陪产假', '路途假', '其他'];
const FormItem = Form.Item;

class Audit extends Component {
    static propTypes = {
        location: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {
            img: [],
        };
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { form } = this.props;
        const { img } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return false;
            const startAt = fieldsValue.startAt;
            const endAt = fieldsValue.endAt;
            const res = {
                ...fieldsValue,
                endAt: startAt.format('YYYY-MM-DD'),
                startAt: endAt.format('YYYY-MM-DD'),
                img,
            };
            console.log('res', res);
        });
    }
    // 删除图片
    removeUpload = (imgs, keyword) => {
        this.setState({ [keyword]: imgs });
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

    render() {
        // const { location } = this.props;
        const { img } = this.state;
        console.log('Goback', this.props);
        return (
            <div className="e-mg-audit">
                <Goback {...this.props} title="请假" />
                <Form onSubmit={this.handleSubmit} className="margin-top-40 e-mg-audit-form">
                    <MySelect
                        {...this.props}
                        label="请假类型"
                        placeholder="请选择(必选)"
                        keyword="type"
                        defaultValue=""
                        required
                        requiredErr="请假类型不能为空"
                        data={types || []}
                        width="260"
                    />
                    <MyDatePicker
                        {...this.props}
                        label="开始时间"
                        placeholder="请选择(必选)"
                        keyword="startAt"
                        defaultValue=""
                        required
                        requiredErr="请选择开始时间"
                        data={types || []}
                        width="260"
                    />
                    <MyDatePicker
                        {...this.props}
                        label="结束时间"
                        placeholder="请选择(必选)"
                        keyword="endAt"
                        defaultValue=""
                        required
                        requiredErr="请选择结束时间"
                        data={types || []}
                        width="260"
                    />
                    <MyInput
                        {...this.props}
                        label="请假天数"
                        placeholder="请输入请假天数(必填)"
                        keyword="daynum"
                        defaultValue=""
                        type="number"
                        max={20}
                        typeErr="请假天数必须为数字且不能超过20天"
                        required
                        requiredErr="请假天数不能为空"
                        width="260"
                    />
                    <MyTextArea
                        {...this.props}
                        label="请假事由"
                        placeholder="请输入请假事由(必选)"
                        keyword="reason"
                        defaultValue=""
                        required
                        requiredErr="请假事由不能为空"
                        width="500"
                    />
                    <FormItem
                        {...formItemLayout}
                        label="添加图片"
                        style={{ color: '#2A2A2A' }}
                    >
                        <ImgUpload title="（支持.jpg, .jpeg, .bmp, .gif, .png类型文件， 5M以内）" keyword="img" fileList={img || []} changeUpdate={this.changeUpdate} removeUpload={this.removeUpload} {...this.props} />
                    </FormItem>
                    <SubmitBtn />
                </Form>
            </div>
        );
    }
}

Audit.propTypes = {
    form: PropTypes.object,
};

export default Form.create()(Audit);
