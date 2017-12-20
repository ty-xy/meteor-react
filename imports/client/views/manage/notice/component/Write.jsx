import React, { PureComponent } from 'react';
import { Button, Col, Form, Modal } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import format from 'date-format';

import Company from '../../../../../schema/company';
import InputArea from '../../component/InputArea';
import InputType from '../../component/InputType';
import ImgUpload from '../../component/ImgUpload';
import FileUpload from '../../component/FileUpload';
import MyRadio from '../../component/Radio';
import feedback from '../../../../../util/feedback';
import ChoosePeopleModel from '../../../../components/ChoosePeopleModel';
import PeopleList from '../../audit/component/PeopleList';

const FormItem = Form.Item;

class Write extends PureComponent {
    static propTypes = {
        form: PropTypes.object,
        history: PropTypes.object,
        location: PropTypes.object,
        companyInfo: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {
            file: [],
            img: [],
            group: [],
            visible: false,
            groupRequire: true,
            requireGroupNotice: false,
        };
    }
    componentWillMount() {
        const { editData = {} } = this.props.location.state || {};
        if (editData._id) {
            this.setState({ ...editData });
        }
    }
    // 获取添加的人员
    getGroup = (keyword, data) => {
        this.setState({ [keyword]: data, requireGroupNotice: false });
    }
    // switch
    handleSwitch = (e) => {
        this.setState({ isSecrecy: e });
    }
    // 公告提交、编辑
    formSubmit = (e) => {
        e.preventDefault();
        const { form, location, companyInfo } = this.props;
        const { img, file, group, groupRequire, isSecrecy, noticeId } = this.state;
        console.log('this.state', this.state);
        form.validateFields((err, fields) => {
            if (err) {
                return false;
            }
            fields.isSecrecy = isSecrecy || false;
            fields.up = (location.state && location.state.editData.up) || false;
            fields.img = img;
            fields.file = file;
            fields.group = group;
            fields.noticeId = noticeId;
            fields.content = fields.content.replace(/[\n\r]/g, '<br/>');
            if (groupRequire) {
                if (group.length === 0) {
                    this.setState({ requireGroupNotice: true });
                    feedback.dealError({ reason: '请选择通知范围' });
                    return false;
                }
            }
            if (location.state && location.state.editData._id) {
                fields._id = location.state.editData._id;
                Meteor.call(
                    'updateNotice',
                    { ...fields },
                    (error) => {
                        if (err) {
                            feedback.dealError(error);
                        } else {
                            feedback.successToastFb('修改成功', () => { this.props.history.push({ pathname: '/manage/notice/list' }); });
                        }
                    },
                );
            } else {
                let peos = [];
                console.log('title', fields, companyInfo);
                if (group && group.length) {
                    group.forEach((depId) => {
                        for (let i = 0; i < (companyInfo.deps && companyInfo.deps.length) || 0; i++) {
                            if (depId === companyInfo.deps[i].id) {
                                peos = peos.concat(companyInfo.deps[i].members);
                                break;
                            }
                        }
                        if (depId === companyInfo._id) {
                            const companyMember = companyInfo.members.map(item => (item.userId));
                            peos = peos.concat(companyMember);
                        }
                    });
                }
                const peoRes = [];
                peos.forEach((item) => {
                    if (peoRes.indexOf(item) === -1) {
                        peoRes.push(item);
                    }
                });
                console.log('peoRes', peos, peoRes);
                const toMembers = peos.map(userId => ({ userId }));
                Meteor.call(
                    'createNotice',
                    { ...fields, toMembers },
                    (error) => {
                        if (error) {
                            feedback.dealError(error);
                        } else {
                            feedback.successToastFb('创建成功', () => { this.props.history.push({ pathname: '/manage/notice/list' }); });
                        }
                    },
                );
            }
        });
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
    // 删除图片
    removeUpload = (imgs, keyword) => {
        this.setState({ [keyword]: imgs });
    }
    // 预览
    handlePreviewCancel = (bool) => {
        const { form } = this.props;
        form.validateFields((err) => {
            if (err) {
                return false;
            }
            this.setState({ visible: bool });
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
    render() {
        const { editData = {} } = this.props.location.state || {};
        const { img, visiblegroup, title, content, group, file } = this.state;
        const date = new Date();
        const year = date.getFullYear();
        let month = '';
        if (date.getMonth() === 12) {
            month = 1;
        } else {
            month = date.getMonth() + 1;
        }
        const day = date.getDate();
        const { getFieldsValue } = this.props.form;
        return (
            <Form onSubmit={this.formSubmit} className="e-mg-notice-write-form">
                <Col span={24}>
                    <ChoosePeopleModel
                        visible={visiblegroup}
                        cancel={this.handleCancel}
                        ok={this.handleOk}
                        keyword="group"
                        defaultValue={group || []}
                        modelTitle="选人"
                        isSelecteGroup
                    >
                        <FormItem
                            label="发送范围"
                            style={{ marginBottom: '0px' }}
                        >
                            <PeopleList
                                keyword="group"
                                iconTitle="选择部门"
                                isSelecteGroup
                                componentSelectedUser={group || []}
                                showModal={this.showModal}
                                handleGroupChange={this.handleGroupChange}
                                handlePeopleChange={this.handlePeopleChange}
                                {...this.props}
                                {...this.state}
                            />
                        </FormItem>
                    </ChoosePeopleModel>
                </Col>
                <InputType title="标题：" required requiredErr="请填写公告标题" keyword="title" editData={editData} {...this.props} />
                <InputArea title="正文：" required requiredErr="请填写公告正文" defaultValue={(content || '').replace(/<br\/>/g, '\r\n')} keyword="content" {...this.props} />
                <ImgUpload title="添加图片：（支持.jpg, .jpeg, .bmp, .gif, .png类型文件， 5M以内）" keyword="img" fileList={img || []} changeUpdate={this.changeUpdate} removeUpload={this.removeUpload} {...this.props} />
                <FileUpload title="添加附件：（支持.doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip, .rar类型文件， 5M以内）" keyword="file" fileList={file || []} removeUpload={this.removeUpload} changeUpdate={this.changeUpdate} {...this.props} />
                <MyRadio title="设为保密公告" subtitle="接收人只能查看，消息不可转发；公告详情页有接收人真实姓名水印，防止截图发送" keyword="isSecrecy" handleSwitch={this.handleSwitch} editData={editData} {...this.props} />
                <Col span={24} style={{ marginTop: '40px' }}>
                    <Button htmlType="submit" className="e-mg-button-primary margin-right-20">保存</Button>
                    <Button className="e-mg-button-default" onClick={() => this.handlePreviewCancel(true)}>预览</Button>
                </Col>
                <Modal
                    title={title}
                    visible={this.state.visible}
                    onCancel={() => this.handlePreviewCancel(false)}
                    footer={null}
                    className="e-mg-notice-preview"
                >   <p className="margin-bottom-10 font18">{getFieldsValue().title}<span style={{ marginLeft: '10px', color: 'rgba(0, 0, 0, 0.4)', fontSize: '12px' }}>{format('yyyy-MM-dd hh:mm', new Date())}</span></p>
                    <div dangerouslySetInnerHTML={{ __html: (getFieldsValue().content || '').replace(/\n/g, '<br/>') }} />
                    <p style={{ textAlign: 'right' }}>{`${year}年${month}月${day}日`}</p>
                </Modal>
            </Form>
        );
    }
}

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
})(Form.create()(Write));
