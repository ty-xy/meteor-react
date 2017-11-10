import React, { Component } from 'react';
import { Form, Col, Row, Button, Icon } from 'antd';
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
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 6 },
    },
};

const FormItem = Form.Item;
let uuid = 0;

class CheckBill extends Component {
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
            const details = [];
            let total = 0;
            for (let i = 0; i < uuid + 1; i++) {
                const amount = fieldsValue[`amount-${i}`];
                total += amount;
                const category = fieldsValue[`category-${i}`];
                const reason = fieldsValue[`reason-${i}`];
                details.push({
                    amount,
                    category,
                    reason,
                });
            }
            const res = {
                userId: Meteor.user()._id,
                status: '待审核',
                type: '报销',
                company: UserUtil.getCompany(),
                copy,
                approvers,
                img,
                file,
                details,
                total,
            };
            console.log('res', res);
            Meteor.call(
                'createCheckBill',
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
    // 添加明细
    add = () => {
        uuid++;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        form.setFieldsValue({
            keys: nextKeys,
        });
    }
    // 删除明细
    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }
    // 明细列表
    addformItem = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [0] });
        const keys = getFieldValue('keys');
        return keys.map((k, index) => (
            <Row
                key={k}
                className="border-bottom-eee margin-bottom-20"
            >
                <Row className="margin-bottom-20"><Col span={6} className="text-right padding-right-20 font18">报销明细 ({index + 1})</Col></Row>
                <MyInput
                    {...this.props}
                    label="报销金额"
                    placeholder="请输入报销金额(必填)"
                    keyword={`amount-${k}`}
                    defaultValue=""
                    type="number"
                    max={2000}
                    typeErr="报销金额必须为数字且不能超过2000元"
                    required
                    requiredErr="报销金额不能为空"
                    width="500"
                />
                <MyInput
                    {...this.props}
                    label="报销类别"
                    placeholder="请输入报销类别(必填)"
                    keyword={`category-${k}`}
                    defaultValue=""
                    required
                    requiredErr="报销类别不能为空"
                    width="500"
                />
                <MyTextArea
                    {...this.props}
                    label="费用明细"
                    placeholder="请输入费用明细"
                    keyword={`reason-${k}`}
                    defaultValue=""
                    width="500"
                />
                {keys.length > 1 ? (
                    <FormItem {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={() => this.remove(k)} style={{ width: '260px', color: '#F6423A', borderColor: '#F6423A' }}>
                            <Icon
                                className="dynamic-delete-button"
                                type="delete"
                                disabled={keys.length === 1}
                            />删除报销明细
                        </Button>
                    </FormItem>
                ) : null}
            </Row>
        ));
    }
    render() {
        // const { location } = this.props;
        const { img, file, isApproversAuto, requireGroupNotice, approvers, copy } = this.state;
        // console.log('leave', this.props);
        return (
            <div className="e-mg-audit-leave">
                <Goback {...this.props} title="报销" />
                <Form onSubmit={this.handleSubmit} className="margin-top-40 e-mg-audit-form">
                    {this.addformItem()}
                    <FormItem {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={this.add} style={{ width: '260px' }}>
                            <Icon type="plus" /> 增加报销明细
                        </Button>
                    </FormItem>
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

CheckBill.propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
};

export default Form.create()(CheckBill);
