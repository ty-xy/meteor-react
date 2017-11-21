import React, { Component } from 'react';
import { Table, Button, Popconfirm } from 'antd';

import EditableCell from './EditableCell';


class EditableTable extends Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '名称',
            dataIndex: 'name',
            width: '30%',
            render: (text, record) => (
                <EditableCell
                    value={text}
                    onChange={this.onCellChange(record.key, 'name')}
                />
            ),
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                this.state.dataSource.length > 1 ?
                    (
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(record.key)}>
                            <p>删除</p>
                        </Popconfirm>
                    ) : null
            ),
        }];

        this.state = {
            dataSource: [{
                key: '0',
                name: 'Edward King 0',
            }, {
                key: '1',
                name: 'Edward King 1',
                age: '32',
                address: 'London, Park Lane no. 1',
            }],
            count: 2,
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
    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    }
    render() {
        const { dataSource } = this.state;
        const columns = this.columns;
        return (
            <div>
                <Button className="editable-add-btn" onClick={this.handleAdd}>添加</Button>
                <Table bordered dataSource={dataSource} columns={columns} />
            </div>
        );
    }
}
export default EditableTable;

