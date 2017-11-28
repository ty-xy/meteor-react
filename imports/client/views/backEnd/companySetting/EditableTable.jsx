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

class EditableTable extends Component {
    static propTypes = {
        team: PropTypes.array,
        currentCompanyId: PropTypes.string,
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
                dataIndex: 'operation',
                render: record => (
                    this.state.dataSource.length >= 1 ?
                        (
                            <Popconfirm title="确定要删除该子管理员么?" onConfirm={() => this.onDelete(record.key)}>
                                <p>删除</p>
                            </Popconfirm>
                        ) : null
                ),
            }],
            dataSource: [{
                createdAt: 'Tue Nov 07 2017 15:09:34 GMT+0800 (CST)',
                profile: {
                    name: '星星',
                    avatarColor: '#29b6f6',
                    avatar: '',
                },
                _id: '9A8GrFpDd8TyhCAPs',
                key: '9A8GrFpDd8TyhCAPs',
            }],
        };
    }
    onCellChange = (key, dataIndex) => (value) => {
        const dataSource = [...this.state.dataSource];
        const target = dataSource.find(item => item.key === key);
        if (target) {
            target[dataIndex] = value;
            this.setState({ dataSource });
        }
    }
    onDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
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
        const { dataSource, columns } = this.state;
        return (
            <div className="sub-manage-table">
                <div className="sub-manage-table-title">
                    <span>设置子管理员</span> &nbsp;
                    <Button className="editable-add-btn" onClick={this.handleAdd}>添加</Button>
                </div>
                <Table dataSource={dataSource} columns={columns} />
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
    const members = [];
    for (const value of Object.values(currentCompany.members)) {
        members.push(value.userId);
    }
    const team = [
        {
            name: currentCompany.name,
            members,
            department: [], // 不存在的时候需要传一个空数组
        },
    ];
    return {
        team,
        currentCompanyId,
    };
})(EditableTable);
