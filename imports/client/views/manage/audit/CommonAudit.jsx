import React, { Component } from 'react';
import { Form, Row } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Goback from './component/Goback';
import MyInput from './component/Input';
import MyTextArea from './component/InputArea';
import ImgUpload from '../component/ImgUpload';
import FileUpload from '../component/FileUpload';
import SubmitBtn from './component/SubmitBtn';
import GroupSelect from './component/GroupSelect';
import feedback from '../../../../util//feedback';
import UserUtil from '../../../../util/user';


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

const FormItem = Form.Item;

class CommonAudit extends Component {
    static propTypes = {
        location: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {
            img: [],
            file: [],
            groupRequire: true, // 选择审核对象是否必填
            requireGroupNotice: false, // 必填项错误信息是否提示
            approvers: [], // 选择的审核对象
            copy: [],
        };
    }
    // 获取添加的人员
    getGroup = (keyword, data) => {
        this.setState({ [keyword]: data, requireGroupNotice: false });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { form } = this.props;
        const { img, file, approvers, copy, groupRequire } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) {
                return false;
            }
            if (groupRequire) {
                if (approvers.length === 0) {
                    this.setState({ requireGroupNotice: true });
                    return false;
                }
            }
            const res = {
                ...fieldsValue,
                copy,
                approvers,
                img,
                file,
                userId: Meteor.user()._id,
                status: '待审核',
                type: '通用审批',
                company: UserUtil.getCompany(),
            };
            console.log('res', res);
            Meteor.call(
                'createCommonAudit',
                { ...res },
                (_err) => {
                    if (_err) {
                        feedback.dealError(_err);
                    } else {
                        feedback.successToastFb('创建成功', () => { this.props.history.push({ pathname: '/manage/audit' }); });
                    }
                },
            );
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
        // const { img, file } = this.state;
        if (name === 'img') {
            this.setState({ img: imgs });
        }
        if (name === 'file') {
            this.setState({ file: imgs });
        }
    }
    // 明细列表
    addformItem = () => (
        <Row>
            <MyInput
                {...this.props}
                label="申请内容"
                placeholder="请输入申请内容详情(必填)"
                keyword="content"
                defaultValue=""
                required
                requiredErr="申请内容不能为空"
                width="500"
            />
            <MyTextArea
                {...this.props}
                label="审批详情"
                placeholder="请输入审批详情"
                required
                requiredErr="审批详情不能为空"
                keyword="detail"
                defaultValue=""
                width="500"
            />
        </Row>
    )
    render() {
        // const { location } = this.props;
        const { img, file, isApproversAuto, requireGroupNotice, approvers, copy } = this.state;
        // console.log('leave', this.props);
        return (
            <div className="e-mg-audit-leave">
                <Goback {...this.props} title="通用审批" />
                <Form onSubmit={this.handleSubmit} className="margin-top-40 e-mg-audit-form">
                    {this.addformItem()}
                    <FormItem
                        {...formItemLayout}
                        label="添加图片"
                        style={{ color: '#2A2A2A', marginBottom: '0px' }}
                    >
                        <ImgUpload title="（支持.jpg, .jpeg, .bmp, .gif, .png类型文件， 5M以内）" keyword="img" fileList={img || []} changeUpdate={this.changeUpdate} removeUpload={this.removeUpload} {...this.props} />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="添加附件"
                        style={{ color: '#2A2A2A', marginBottom: '0px' }}
                    >
                        <FileUpload title="（支持.doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip, .rar类型文件， 5M以内）" keyword="file" fileList={file || []} removeUpload={this.removeUpload} changeUpdate={this.changeUpdate} {...this.props} />
                    </FormItem>
                    <GroupSelect
                        keyword="approvers"
                        label="审批人"
                        isSelected={isApproversAuto}
                        isSelectedTrueTitle="审批人已经由管理员预设"
                        isSelectedFalseTitle="添加审批人"
                        selectedValue={approvers}
                        required={requireGroupNotice}
                        requiredErr="审批人必选"
                        getGroup={this.getGroup}
                        modelTitle="选人"
                        formItemLayout={formItemLayout}
                        offset={6}
                        iconTitle="审批人"
                    />
                    <GroupSelect
                        keyword="copy"
                        label="抄送人"
                        isSelectedFalseTitle="添加抄送人"
                        isSelectedFalseTitleDes="(审批通知后,通知抄送人)"
                        selectedValue={copy}
                        getGroup={this.getGroup}
                        modelTitle="选人"
                        formItemLayout={formItemLayout}
                        offset={6}
                        iconTitle="抄送人"
                    />
                    <SubmitBtn {...this.props} />
                </Form>
            </div>
        );
    }
}

CommonAudit.propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
};

export default Form.create()(CommonAudit);
