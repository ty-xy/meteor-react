import { Table } from 'antd';
import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import format from 'date-format';

// const data = [{
//     createdAt: 'Tue Nov 07 2017 15:09:34 GMT+0800 (CST)',
//     name: 'test.jpg',
//     fromName: '星星',
//     key: '9A8GrFpDd8TyhCAPs',
// }];

@pureRender
class SearchTask extends Component {
    static propTypes = {
        tasks: PropTypes.array,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            columns: [{
                title: '任务',
                dataIndex: 'name',
                render: name => (
                    <div className="search-all-user">
                        <p>{name}</p>
                    </div>),
            }, {
                title: '',
                dataIndex: 'createdName',
                render: createdName => <p>{createdName}</p>,
            }, {
                title: '',
                dataIndex: 'createdAt',
                render: text => <p>{format('yyyy-MM-dd', text)}</p>,
                // render: text => <span>2017-10-10</span>,
            }],
        };
    }
    render() {
        const data = this.props.tasks;
        return (
            <Table columns={this.state.columns} dataSource={data} />
        );
    }
}

export default SearchTask;
