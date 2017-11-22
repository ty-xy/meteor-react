import React, { Component } from 'react';
import { Form, Input, Button, Select, Cascader, Modal } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import Avatar from '../components/Avatar';
import AvatarSelf from '../components/AvatarSelf';
import Icon from '../components/Icon';
import feedback from '../../util/feedback';
// import AddGroup from '../views/chat/chatSideLeft/addChat/AddGroup';
// import SelectMembers from '../features/SelectMembers';

const FormItem = Form.Item;
const Option = Select.Option;

const residences = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
            value: 'xihu',
            label: 'West Lake',
        }],
    }],
}, {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
        }],
    }],
}];
class CreateTeam extends Component {
    static propTypes = {
        form: PropTypes.object,
        isShowAdd: PropTypes.bool,
    }
    constructor() {
        super();
        this.state = {
            formLayout: 'horizontal',
            showSelect: true,
            teamLogo: 'http://oxldjnom8.bkt.clouddn.com/companyLogo.png',
            industryType: [
                {

                },
            ],
        };
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, formValues) => {
            if (!err) {
                formValues.logo = this.state.teamLogo;
                console.log(formValues);
                Meteor.call('createCompany', formValues, (error, result) => {
                    if (result) {
                        feedback.dealSuccess('创建成功');
                    }
                });
            }
        });
    }
    handleUploadImg = (e) => {
        const image = e.target.files[0];
        if (!image) {
            return;
        }
        const reader = new FileReader();
        const changeAvatar = this.changeAvatar;
        reader.onloadend = function () {
            Meteor.call('uploadImg', this.result, (err, result) => {
                changeAvatar(result);
                if (err) {
                    return console.error(err.reason);
                }
                console.log('修改头像成功');
            });
        };
        reader.readAsDataURL(image);
    }
    changeAvatar = (avatarUrl) => {
        this.setState({
            teamLogo: avatarUrl,
        });
    }
    handleAddMembers = () => {
        this.setState({
            showSelect: true,
        });
    }
    closeSelect = () => {
        this.setState({
            showSelect: false,
        });
    }
    render() {
        const { formLayout } = this.state;
        const formItemLayout = formLayout === 'horizontal' ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        } : null;
        const buttonItemLayout = formLayout === 'horizontal' ? {
            wrapperCol: { span: 14, offset: 4 },
        } : null;
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form layout={formLayout} onSubmit={this.handleSubmit}>
                    <FormItem>

                        <div className="upload-team-avatar">
                            <Avatar avatar={this.state.teamLogo} name="团队" />
                            <p className="edit-avatar">修改头像
                                <input type="file" id="avatar" onChange={this.handleUploadImg} ref={i => this.fileInput = i} />
                            </p>
                        </div>
                    </FormItem>
                    <FormItem
                        label="团队名称"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('name', {
                            rules: [{
                                type: 'string', message: '类型为string!',
                            }, {
                                required: true, message: '团队名称!',
                            }],
                        })(
                            <Input placeholder="团队名称" />,
                        )}
                    </FormItem>
                    <FormItem
                        label="行业类型"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('industryType', {
                            rules: [{
                                type: 'string', message: '类型为string!',
                            }, {
                                required: true, message: '请选择行业类型!',
                            }],
                        })(
                            <Select placeholder="行业类型">
                                <Option value="建筑设计">建筑设计</Option>
                                <Option value="土木工程">土木工程</Option>
                                <Option value="装饰装潢">装饰装潢</Option>
                                <Option value="房地产">房地产</Option>
                                <Option value="物业管理">物业管理</Option>
                                <Option value="建材">建材</Option>
                                <Option value="其他">其他</Option>
                            </Select>,
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="所在地区"
                    >
                        {getFieldDecorator('residence', {
                            initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                            rules: [{ type: 'array' }],
                        })(
                            <Cascader options={residences} />,
                        )}
                    </FormItem>
                    {
                        this.props.isShowAdd ?
                            <FormItem
                                label="添加成员"
                                {...formItemLayout}
                            >
                                <br />
                                <div className="members-avatar">
                                    <div className="avatar-wrap">
                                        <AvatarSelf />
                                        <Avatar name="哈哈" avatarColor="red" avatar="" />
                                    </div>
                                    <div className="add-members" onClick={this.handleAddMembers}>
                                        <Icon icon="icon-tianjia3 icon" size={35} />
                                    </div>
                                </div>
                            </FormItem>
                            :
                            null

                    }
                    <FormItem {...buttonItemLayout}>
                        <Button type="primary" htmlType="submit">{this.props.isShowAdd ? '创建' : '保存'}</Button>
                    </FormItem>
                </Form>
                <Modal
                    title="选择人员"
                    visible={this.state.showSelect}
                    onCancel={this.closeSelect}
                    wrapClassName="create-team-mask"
                    footer={null}
                >
                选择人员
                </Modal>
                {/* <SelectMembers /> */}
            </div>
        );
    }
}

export default Form.create({})(CreateTeam);
