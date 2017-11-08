import React, { Component } from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Goback from './component/Goback';
import MyInput from './component/Input';
import MySelect from './component/Select';
import MyDatePicker from './component/Date';
import MyTextArea from './component/InputArea';
import ImgUpload from '../component/ImgUpload';
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
const types = ['事假', '病假', '年假', '调休', '婚假', '产假', '陪产假', '路途假', '其他'];
const FormItem = Form.Item;

class Leave extends Component {
    static propTypes = {
        location: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {
            img: [],
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
        const { img, approvers, copy, groupRequire } = this.state;
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
            fieldsValue.approvers = approvers;
            fieldsValue.copy = copy;
            fieldsValue.userId = Meteor.user()._id;
            const startAt = fieldsValue.startAt;
            const endAt = fieldsValue.endAt;
            const res = {
                ...fieldsValue,
                endAt: startAt.format('YYYY-MM-DD'),
                startAt: endAt.format('YYYY-MM-DD'),
                img,
                status: '待审核',
                company: UserUtil.getCompany(),
            };
            console.log('res', res);
            Meteor.call(
                'createLeave',
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
    render() {
        // const { location } = this.props;
        const { img, isApproversAuto, requireGroupNotice, approvers, copy } = this.state;
        // console.log('leave', this.props);
        return (
            <div className="e-mg-audit-leave">
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
                        modelTitle="选团队"
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

Leave.propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
};

export default Form.create()(Leave);
