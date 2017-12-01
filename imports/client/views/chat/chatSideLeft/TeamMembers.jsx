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
    }
    constructor(...args) {
        super(...args);
        this.state = {
            visible: false,
            columns: [{
                title: '',
                dataIndex: 'profile',
                render: profile => (
                    <div className="team-memebers-info">
                        <Avatar name={profile.name} avatarColor={profile.avatarColor} avatar={profile.avatar} />
                        <p>{profile.name}</p>
                    </div>),
            }],
        };
    }
    quitTeam = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, formValues) => {
            if (err) {
                throw err;
            }
            console.log(555, formValues);
            Meteor.call('');
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
        <Icon icon="icon-tuichu" onClick={this.quitTeam} />
    </div>)

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
        const { name = '' } = this.props.currentCompany;
        return (
            <div className="team-members">
                <Table
                    columns={this.state.columns}
                    dataSource={this.props.currentMembers}
                    title={() => this.renderHeader(name, this.props.depsName)}
                    rowKey={record => record._id}
                />
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
            currentMembers = currentCompany.members || [];
            currentMembers.forEach((x) => {
                x.key = x.userId;
                x.profile = Meteor.users.findOne({ _id: x.userId }, { fields: fields.searchUser }).profile;
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
