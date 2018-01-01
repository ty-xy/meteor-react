import React, { Component } from 'react';
import { Table, Modal, Form, Input, Button, Radio } from 'antd';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import Avatar from '../../../components/Avatar';
import Icon from '../../../components/Icon';
import Company from '../../../../schema/company';
import fields from '../../../../util/fields';
import feedback from '../../../../util/feedback';
import ChatFriendInfo from '../chatWindow/ChatFriendInfo';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
@pureRender
class TeamMembers extends Component {
    static propTypes = {
        form: PropTypes.object,
        teamId: PropTypes.string,
        currentMembers: PropTypes.array || [],
        currentCompany: PropTypes.object,
        depsName: PropTypes.string,
        changeTo: PropTypes.func,
        handleToggle: PropTypes.func,
        handleClick: PropTypes.func,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            visible: false,
            isShowFriendInfo: false,
            chatFriendId: '',
            columns: [{
                title: '',
                dataIndex: '',
                render: row => (
                    <div className="team-memebers-info" onClick={() => this.showFriendInfo(row.userId)}>
                        <Avatar name={row.profile.name} avatarColor={row.profile.avatarColor} avatar={row.profile.avatar} />
                        <p>{row.profile.name}</p>
                    </div>),
            }],
        };
    }
    handleFriendInfo = () => {
        this.setState({
            isShowFriendInfo: !this.state.isShowFriendInfo,
        });
    }
    showFriendInfo = (friendId) => {
        this.setState({
            isShowFriendInfo: true,
            chatFriendId: friendId,
        });
    }
    quitTeam = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, formValues) => {
            if (err) {
                return feedback.dealWarning('请选择离开原因');
            }
            console.log(555, formValues);
            await Meteor.callPromise('deleteCompanyMember', {
                companyId: this.props.currentCompany._id,
            });
            this.handleCancel();
        });
    }
    renderHeader = (name, depsName) => (<div className="dev-title">
        <p>
            <span className="company">{name}</span>
            {
                depsName ?
                    <span>&gt;{depsName}</span>
                    :
                    null
            }
        </p>
        {
            this.props.currentCompany && this.props.currentCompany.admin !== Meteor.userId() ?
                <Icon icon="icon-tuichu" onClick={this.quitTeam} size={18} />
                :
                null
        }
    </div>)

    render() {
        console.log(this.props);
        const { formLayout } = this.state;
        const formItemLayout = formLayout === 'horizontal' ? {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        } : null;
        const buttonItemLayout = formLayout === 'horizontal' ? {
            wrapperCol: { span: 14, offset: 4 },
        } : null;
        const { getFieldDecorator } = this.props.form;
        const { name = '' } = this.props.currentCompany || {};
        return (
            <div className="team-members">
                <Table
                    columns={this.state.columns}
                    dataSource={this.props.currentMembers}
                    title={() => this.renderHeader(name, this.props.depsName)}
                    rowKey={record => record._id}
                />
                {
                    this.state.isShowFriendInfo ?
                        <ChatFriendInfo
                           {...this.props}
                            handleFriendInfo={this.handleFriendInfo}
                            friendId={this.state.chatFriendId}
                            temporaryChat={this.state.chatFriendId !== Meteor.userId()}
                            changeTo={this.props.changeTo}
                            handleToggle={this.props.handleToggle}
                            handleClick={this.props.handleClick}
                        />
                        :
                        null

                }
                <Modal
                    title="退出团队"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    wrapClassName="create-team-mask"
                    footer={null}
                >
                    <div>
                        <Form layout={formLayout} onSubmit={this.handleSubmit}>
                            <FormItem
                                {...formItemLayout}
                                label="请选择退出原因"
                            >
                                {getFieldDecorator('radio-group', {
                                    rules: [{
                                        type: 'string', message: '类型为string!',
                                    }, {
                                        required: true, message: '团队名称!',
                                    }],
                                })(
                                    <RadioGroup>
                                        <Radio value="离职">离职</Radio>
                                        <Radio value="非企业员工">非企业员工</Radio>
                                        <Radio value="其他">其他</Radio>
                                    </RadioGroup>,
                                )}
                            </FormItem>
                            <FormItem
                                label="其他补充(选填)"
                                {...formItemLayout}
                            >
                                {getFieldDecorator('otherReason', {
                                    rules: [{
                                        type: 'string', message: '类型为string!',
                                    }],
                                })(
                                    <TextArea rows={4} />,
                                )}
                            </FormItem>
                            <FormItem {...buttonItemLayout}>
                                <Button type="primary" htmlType="submit">确定</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Form.create({})(
    withTracker(({ teamId, depsId, deps }) => {
        Meteor.subscribe('users');
        Meteor.subscribe('company');
        const currentCompany = Company.findOne({ _id: teamId });
        let currentMembers = [];
        let depsName = '';
        if (deps === 'deps') {
            currentMembers = currentCompany.members.filter(x => x.dep === depsId);
            depsName = currentCompany.deps.find(x => x.id === depsId).name;
            currentMembers.forEach((x) => {
                x.key = x.userId;
                x.profile = Meteor.users.findOne({ _id: x.userId }, { fields: fields.searchUser }).profile;
            });
        } else {
            currentMembers = (currentCompany && currentCompany.members) || [];
            currentMembers.forEach((x) => {
                x.key = x.userId;
                x.profile = Meteor.users.findOne({ _id: x.userId }, { fields: fields.searchUser }).profile;
                x.profile._id = x.userId;
            });
        }
        return {
            currentMembers,
            teamId,
            currentCompany,
            depsName,
        };
    })(TeamMembers),
);
