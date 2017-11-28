import React, { Component } from 'react';
import { Table, Button, Popconfirm, Modal } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import Avatar from '../../../components/Avatar';
import SelectMembers from '../../../features/SelectMembers';
import UserUtil from '../../../../util/user';
import feedback from '../../../../util/feedback';
import Company from '../../../../schema/company';
import fields from '../../../../util/fields';

class EditableTable extends Component {
    static propTypes = {
        team: PropTypes.array,
        currentCompanyId: PropTypes.string,
        SubManages: PropTypes.array,
    }
    constructor(props) {
        super(props);
        this.state = {
            showSelect: false,
            columns: [{
                title: '名称',
                dataIndex: 'profile',
                render: profile => (
                    <div className="search-all-user">
                        <Avatar name={profile.name} avatarColor={profile.avatarColor} avatar={profile.avatar} />
                        <p>{profile.name}</p>
                    </div>),
            }, {
                title: '操作',
                dataIndex: '_id',
                render: _id => (
                    <Popconfirm title="确定要删除该子管理员么?" onConfirm={() => this.onDelete(_id)}>
                        <p>删除</p>
                    </Popconfirm>
                ),
            }],
        };
    }
    onDelete = (key) => {
        Meteor.call('deleteSubAdmin', this.props.currentCompanyId, key, (err) => {
            if (err) {
                console.error(err);
            }
            feedback.dealSuccess('删除成功');
        });
    }
    closeSelect = () => {
        this.setState({
            showSelect: false,
        });
    }
    confirmSelected = (members) => {
        this.setState({
            showSelect: false,
        });
        Meteor.call('addSubAdmin', this.props.currentCompanyId, members, (err) => {
            if (err) {
                console.error(err);
            }
            feedback.dealSuccess('添加成功');
        });
    }
    handleAdd = () => {
        this.setState({
            showSelect: true,
        });
    }
    render() {
        const { columns } = this.state;
        return (
            <div className="sub-manage-table">
                <div className="sub-manage-table-title">
                    <span>设置子管理员</span> &nbsp;
                    <Button className="editable-add-btn" onClick={this.handleAdd}>添加</Button>
                </div>
                <Table dataSource={this.props.SubManages} columns={columns} />
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
                        <div>{this.state.showSelect}</div>

                }
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('company');
    Meteor.subscribe('users');
    const currentCompanyId = UserUtil.getCurrentBackendCompany();
    const currentCompany = Company.findOne({ _id: currentCompanyId });
    const SubManageIds = currentCompany.subAdmin || [];
    const SubManages = SubManageIds.map(_id => Meteor.users.findOne({ _id }, { fields: fields.searchAllUser }));
    const members = [];
    for (const value of Object.values(currentCompany.members)) {
        members.push(value.userId);
    }
    const restUsers = members.filter(x => !SubManageIds.find(y => y === x));
    const team = [
        {
            name: currentCompany.name,
            members: restUsers,
            department: [], // 不存在的时候需要传一个空数组
        },
    ];

    return {
        team,
        currentCompanyId,
        SubManages,
    };
})(EditableTable);
