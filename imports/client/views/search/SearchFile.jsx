import { Table, Icon } from 'antd';
import React, { Component } from 'react';

const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <p>{text}</p>,
}, {
    title: '',
    dataIndex: 'age',
    key: 'age',
}, {
    title: '时间',
    dataIndex: 'address',
    key: 'address',
}, {
    title: 'Action',
    key: 'action',
    render: () => (
        <div>
            <a download>
             下载 <Icon type="download" />
            </a>
        </div>
    ),
}];

const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
}, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
}, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
}];

class SearchFile extends Component {
    render() {
        return (
            <div>
                <Table columns={columns} dataSource={data} />
            </div>
        );
    }
}

export default SearchFile;
