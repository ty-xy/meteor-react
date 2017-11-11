import React, { PureComponent } from 'react';
import { Button, Col, Form, Modal } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import InputArea from '../../component/InputArea';
import InputType from '../../component/InputType';
import ImgUpload from '../../component/ImgUpload';
import FileUpload from '../../component/FileUpload';
import MyRadio from '../../component/Radio';
import feedback from '../../../../../util/feedback';
import GroupSelect from '../../audit/component/GroupSelect';


class Write extends PureComponent {
    static propTypes = {
        form: PropTypes.object,
        history: PropTypes.object,
        location: PropTypes.object,
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
            approvers: [],
        };
    }
    componentWillMount() {
        const { editData = {} } = this.props.location.state || {};
        if (editData._id) {
            this.setState({ img: editData.img, file: editData.file });
        }
    }
    // 获取添加的人员
    getGroup = (keyword, data) => {
        this.setState({ [keyword]: data, requireGroupNotice: false });
    }
    // 公告提交、编辑
    formSubmit = (e) => {
        e.preventDefault();
        const { form, location } = this.props;
        const { img, file, group, groupRequire, approvers } = this.state;
        form.validateFields((err, fields) => {
            if (err) {
                feedback.dealError({ reason: '标题、作者、正文都需填写' });
                return false;
            }
            fields.username = Meteor.user().username;
            fields.isSecrecy = fields.isSecrecy || false;
            fields.up = (location.state && location.state.editData.up) || false;
            fields.img = img;
            fields.file = file;
            fields.group = group;
            fields.company = Meteor.user().profile.mainCompany;
            if (groupRequire) {
                if (approvers.length === 0) {
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
                Meteor.call(
                    'createNotice',
                    { ...fields },
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
    // 预览
    handleCancel = (bool) => {
        this.setState({ visible: bool });
    }
    render() {
        const { editData = {} } = this.props.location.state || {};
        const { img, file, requireGroupNotice } = this.state;
        const { title, content } = this.props.form.getFieldsValue();
        const date = new Date();
        const year = date.getFullYear();
        let month = '';
        if (date.getMonth() === 12) {
            month = 1;
        } else {
            month = date.getMonth() + 1;
        }
        const day = date.getDate();
        return (
            <Form onSubmit={this.formSubmit} style={{ height: '100%', overflow: 'auto' }}>
                <Col span={24} style={{ marginTop: '20px', marginBottom: '-20px' }}>
                    <GroupSelect
                        keyword="approvers"
                        label="发布范围"
                        isSelected={false}
                        isSelectedTrueTitle="(点击头像可删除)"
                        selectedValue={[{}]}
                        required={requireGroupNotice}
                        requiredErr="请选择审批范围"
                        getGroup={this.getGroup}
                        modelTitle="选部门"
                        isSelecteGroup
                        offset={0}
                    />
                </Col>
                <InputType title="标题：" required requiredErr="请填写公告标题" keyword="title" editData={editData} {...this.props} />
                <InputType title="作者：" required requiredErr="请填写公告作者" keyword="author" editData={editData} {...this.props} />
                <InputArea title="正文：" required requiredErr="请填写公告正文" className="margin-bottom-20" editData={editData} keyword="content" {...this.props} />
                <ImgUpload title="添加图片：（支持.jpg, .jpeg, .bmp, .gif, .png类型文件， 5M以内）" keyword="img" fileList={img || []} changeUpdate={this.changeUpdate} removeUpload={this.removeUpload} {...this.props} />
                <FileUpload title="添加附件：（支持.doc, .docx, .xls, .xlsx, .ppt, .pptx, .zip, .rar类型文件， 5M以内）" keyword="file" fileList={file || []} removeUpload={this.removeUpload} changeUpdate={this.changeUpdate} {...this.props} />
                <MyRadio title="设为保密公告" subtitle="接收人只能查看，消息不可转发；公告详情页有接收人真实姓名水印，防止截图发送" keyword="isSecrecy" editData={editData} {...this.props} />
                <Col span={24} className="margin-top-20">
                    <Button htmlType="submit" className="e-mg-button-primary margin-right-20">保存</Button>
                    <Button className="e-mg-button-default" onClick={() => this.handleCancel(true)}>预览</Button>
                </Col>
                <Modal
                    title={title}
                    visible={this.state.visible}
                    onCancel={() => this.handleCancel(false)}
                    footer={null}
                    className="e-mg-notice-preview"
                >
                    <p>{content}</p>
                    <p style={{ textAlign: 'right' }}>{`${year}年${month}月${day}日`}</p>
                </Modal>
            </Form>
        );
    }
}

export default Form.create()(Write);
