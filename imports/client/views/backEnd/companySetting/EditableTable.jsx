import React, { Component } from 'react';
import { Table, Button, Popconfirm } from 'antd';

import Avatar from '../../../components/Avatar';

class EditableTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
    // handleAdd = () => {
    //     const { count, dataSource } = this.state;
    //     const newData = {
    //         key: count,
    //         name: `Edward King ${count}`,
    //         age: 32,
    //         address: `London, Park Lane no. ${count}`,
    //     };
    //     this.setState({
    //         dataSource: [...dataSource, newData],
    //         count: count + 1,
    //     });
    // }
    render() {
        const { dataSource, columns } = this.state;
        return (
            <div className="sub-manage-table">
                <div className="sub-manage-table-title">
                    <span>设置子管理员</span> &nbsp;
                    <Button className="editable-add-btn" onClick={this.handleAdd}>添加</Button>
                </div>

                <Table dataSource={dataSource} columns={columns} />
            </div>
        );
    }
}
export default EditableTable;

