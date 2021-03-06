import React, { Component } from 'react';
import { Form, Col, Row, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Company from '../../../../schema/company';
import Goback from './component/Goback';
import MyInput from './component/Input';
import DatePicker from './component/DatePicker';
import MyTextArea from './component/InputArea';
import ImgUpload from '../component/ImgUpload';
import FileUpload from '../component/FileUpload';
import SubmitBtn from './component/SubmitBtn';
import ChoosePeopleModel from '../../../../client/components/ChoosePeopleModel';
import PeopleList from './component/PeopleList';
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

class Business extends Component {
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
            for (let i = 0; i < uuid + 1; i++) {
                const startAt = fieldsValue[`datepicker-${i}`][0];
                const endAt = fieldsValue[`datepicker-${i}`][1];
                const location = fieldsValue[`location-${i}`];
                details.push({
                    startAt: startAt.format('YYYY-MM-DD'),
                    endAt: endAt.format('YYYY-MM-DD'),
                    location,
                });
            }
            const res = {
                userId: Meteor.user()._id,
                status: '待审核',
                type: '出差',
                company: UserUtil.getMainCompany(),
                copy,
                approvers,
                img,
                file,
                details,
                daynum: fieldsValue.daynum,
                reason: fieldsValue.reason,
            };
            console.log('res', res);
            Meteor.call(
                'createBusiness',
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
    // select people
    showModal = (e, keyword) => {
        e.preventDefault();
        this.setState({
            [`visible${keyword}`]: true,
        });
    }
    // select people cancel
    handleCancel = (e, keyword) => {
        e.preventDefault();
        this.setState({
            [`visible${keyword}`]: false,
            checked: false,
        });
    }
    // 选中的人
    handleOk = (keyword, leftUsers) => {
        this.setState({ [keyword]: leftUsers, [`visible${keyword}`]: false, requireGroupNotice: false });
    }
    // 选中后删除
    handlePeopleChange = (e, id, keyword) => {
        e.preventDefault();
        const res = this.state[keyword];
        const peos = res.filter(item => (item !== id));
        this.setState({ [keyword]: peos });
    }
    // 开始时间限制
    disabledDate = (current, k) => {
        if (k === 0) {
            return current && current.valueOf() < Date.now();
        }
        const preEnd = this.state[`date${k - 1}`];
        return current && current.valueOf() < ((preEnd && preEnd.valueOf()) || Date.now());
    }
    handleChangeDate = (date, key) => {
        this.setState({ [`date${key}`]: date[1] });
    }
    // 明细列表
    formItem = () => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [0] });
        const keys = getFieldValue('keys');
        return keys.map((k, index) => (
            <Row
                key={k}
                className="border-bottom-eee margin-bottom-20"
            >
                <Row className="margin-bottom-20"><Col span={6} className="text-right padding-right-20 font18">出差明细 ({index + 1})</Col></Row>
                <MyInput
                    {...this.props}
                    label="出差地点"
                    placeholder="如北京、上海、杭州(必填)"
                    keyword={`location-${k}`}
                    defaultValue=""
                    max={20}
                    typeErr="请假天数必须为数字且不能超过20天"
                    required
                    requiredErr="出差地点不能为空"
                    width="300"
                />
                <DatePicker
                    keyword={`datepicker-${k}`}
                    k={k}
                    label="时间范围"
                    placeholder={['开始时间(必选)', '结束时间(必选)']}
                    width="300"
                    disabledDate={current => this.disabledDate(current, k)}
                    onChange={this.handleChangeDate}
                    required
                    requiredErr="请选择时间范围"
                    {...this.props}
                />
                {keys.length > 1 ? (
                    <FormItem {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={() => this.remove(k)} style={{ width: '300px', color: '#F6423A', borderColor: '#F6423A' }}>
                            <Icon
                                className="dynamic-delete-button"
                                type="delete"
                                disabled={keys.length === 1}
                            />删除行程明细
                        </Button>
                    </FormItem>
                ) : null}
            </Row>
        ));
    }
    render() {
        // const { location } = this.props;
        // const { img, file, isApproversAuto, requireGroupNotice, approvers, copy } = this.state;
        const { img, file, visibleapprovers, visiblecopy, requireGroupNotice, approvers, copy } = this.state;
        console.log('bussiness', this.props, this.state);
        return (
            <div className="e-mg-audit-leave">
                <Goback {...this.props} title="出差" />
                <Form onSubmit={this.handleSubmit} className="margin-top-40 e-mg-audit-form">
                    {this.formItem()}
                    <FormItem {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={this.add} style={{ width: '300px' }}>
                            <Icon type="plus" /> 增加行程明细
                        </Button>
                    </FormItem>

                    <MyInput
                        {...this.props}
                        label="出差天数"
                        placeholder="请输入出差天数(必填)"
                        keyword="daynum"
                        defaultValue=""
                        type="number"
                        max={20}
                        typeErr="出差天数必须为数字且不能超过20天"
                        required
                        requiredErr="出差天数不能为空"
                        width="300"
                    />
                    <MyTextArea
                        {...this.props}
                        label="出差事由"
                        placeholder="请输入出差事由(必选)"
                        keyword="reason"
                        defaultValue=""
                        required
                        requiredErr="出差事由不能为空"
                        width="500"
                    />
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
                    <ChoosePeopleModel
                        visible={visibleapprovers}
                        cancel={this.handleCancel}
                        ok={this.handleOk}
                        keyword="approvers"
                        defaultValue={approvers || []}
                        modelTitle="选人"
                    >
                        <FormItem
                            {...formItemLayout}
                            label="审批人"
                            className="e-mg-audit-peopleList"
                        >
                            <a href="" onClick={this.showModal} style={{ color: 'rgb(204, 204, 204)' }}>(添加审批人，按照选择顺序提醒审批人)</a>
                            <PeopleList
                                keyword="approvers"
                                iconTitle="审批人"
                                componentSelectedUser={approvers || []}
                                showModal={this.showModal}
                                handleGroupChange={this.handleGroupChange}
                                handlePeopleChange={this.handlePeopleChange}
                                requiredErr="审批人必选"
                                required={requireGroupNotice}
                                {...this.props}
                                {...this.state}
                            />
                        </FormItem>
                    </ChoosePeopleModel>
                    <ChoosePeopleModel
                        visible={visiblecopy}
                        cancel={this.handleCancel}
                        ok={this.handleOk}
                        keyword="copy"
                        defaultValue={copy || []}
                        modelTitle="选人"
                    >
                        <FormItem
                            {...formItemLayout}
                            label="抄送人"
                        >
                            <a href="" onClick={this.showModal} style={{ color: 'rgb(204, 204, 204)' }}>(审批通知后,通知抄送人)</a>
                            <PeopleList
                                keyword="copy"
                                iconTitle="抄送人"
                                componentSelectedUser={copy || []}
                                showModal={this.showModal}
                                handleGroupChange={this.handleGroupChange}
                                handlePeopleChange={this.handlePeopleChange}
                                {...this.props}
                                {...this.state}
                            />
                        </FormItem>
                    </ChoosePeopleModel>
                    <SubmitBtn {...this.props} />
                </Form>
            </div>
        );
    }
}

Business.propTypes = {
    form: PropTypes.object,
    history: PropTypes.object,
};
export default withTracker(() => {
    Meteor.subscribe('company');
    Meteor.subscribe('users');
    const companys = Company.find().fetch();
    const mainCompany = Meteor.user() && Meteor.user().profile.mainCompany;
    let companyInfo = {};
    companys.forEach((item) => {
        if (item._id === mainCompany) {
            companyInfo = item;
        }
    });
    return {
        companyInfo,
        companys,
        allUsers: Meteor.users.find().fetch(),
    };
})(Form.create()(Business));
