import React, { Component } from 'react';
import { Form, Input, Button, Select, Cascader, Modal } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Avatar from '../components/Avatar';
import AvatarSelf from '../components/AvatarSelf';
import Icon from '../components/Icon';
import feedback from '../../util/feedback';
import SelectMembers from '../features/SelectMembers';
import Company from '../../schema/company';
import UserUtil from '../../util/user';
import pcaData from '../../util/pcaData';

const FormItem = Form.Item;
const Option = Select.Option;

class CreateTeam extends Component {
    static propTypes = {
        form: PropTypes.object,
        isShowAdd: PropTypes.bool, // 是否显示添加人员
        handleSubmit: PropTypes.func.isRequired, // 点击确定的回调函数
        currentCompany: PropTypes.object, // 如果是修改信息部分,为前所选公司信息
        team: PropTypes.array,
    }
    constructor() {
        super();
        this.state = {
            formLayout: 'horizontal',
            showSelect: false,
            teamLogo: 'http://oxldjnom8.bkt.clouddn.com/companyLogo.png',
            selectMembers: [],
            selectMembersId: [],
            residences: pcaData.pca,
        };
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, formValues) => {
            if (!err) {
                formValues.logo = this.state.teamLogo;
                if (this.props.isShowAdd) {
                    formValues.members = [Meteor.userId(), ...this.state.selectMembersId].map(x => ({
                        userId: x,
                    }));
                }
                this.props.handleSubmit(formValues);
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
                if (err) {
                    return feedback.dealError(err);
                }
                changeAvatar(result);
                return feedback.successToast('修改头像成功');
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
    confirmSelected = (members) => {
        const selectMembers = members;
        this.setState({
            selectMembersId: members,
            selectMembers: selectMembers.map(_id => Meteor.users.findOne({ _id })),
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
        const { name = '', logo = this.state.teamLogo, industryType = '', residence = [] } = this.props.currentCompany || {};
        return (
            <div>
                <Form layout={formLayout} onSubmit={this.handleSubmit}>
                    <FormItem>

                        <div className="upload-team-avatar">
                            <Avatar avatar={logo} name="团队" />
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
                            initialValue: name,
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
                            initialValue: industryType,
                        })(
                            <Select placeholder="行业类型" >
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
                            initialValue: residence,
                            rules: [{ type: 'array' }],
                        })(
                            <Cascader options={this.state.residences} placeholder="请选择地区" />,
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
                                        {
                                            !this.state.showSelect && this.state.selectMembers.map(user => (
                                                user ?
                                                    <Avatar key={user._id} avatarColor={user.profile && user.profile.avatarColor} name={user.profile && user.profile.name} avatar={user.profile && user.profile.avatar} />
                                                    :
                                                    null
                                            ))
                                        }
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
                {
                    this.state.showSelect ?
                        <Modal
                            title="选择人员"
                            visible
                            onCancel={this.closeSelect}
                            width={430}
                            wrapClassName="create-team-mask"
                            footer={null}
                        >
                            <SelectMembers
                                confirmSelected={this.confirmSelected}
                                team={this.props.team}
                            />
                        </Modal>
                        :
                        null

                }
            </div>
        );
    }
}

export default Form.create({})(
    withTracker(({ currentCompanyId }) => {
        Meteor.subscribe('company');
        Meteor.subscribe('users');
        const currentCompany = Company.findOne({ _id: currentCompanyId });
        const friendIds = UserUtil.getFriends();
        const team = [
            {
                name: 'e建联好友',
                members: friendIds,
                department: [], // 不存在的时候需要传一个空数组
            },
        ];
        return {
            currentCompany,
            team,
        };
    })(CreateTeam),
);
