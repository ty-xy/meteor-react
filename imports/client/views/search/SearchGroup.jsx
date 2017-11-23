import { Table } from 'antd';
import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import format from 'date-format';
import Avatar from '../../components/Avatar';

// const data = [{
//     createdAt: 'Tue Nov 07 2017 15:09:34 GMT+0800 (CST)',
//     profile: {
//         name: '星星',
//         avatarColor: '#29b6f6',
//         avatar: '',
//     },
//     admin: '9A8GrFpDd8TyhCAPs',
//     key: '9A8GrFpDd8TyhCAPs',
// }];

@pureRender
class SearchGroup extends Component {
    static propTypes = {
        groups: PropTypes.array,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            columns: [{
                title: '群组',
                dataIndex: 'profile',
                render: profile => (
                    <div className="search-all-user">
                        <Avatar name={profile.name} avatar={profile.avatar} />
                        <p>{profile.name}</p>
                    </div>),
            }, {
                title: '',
                dataIndex: 'adminName',
                render: adminName => <p>{adminName}</p>,
            }, {
                title: '',
                dataIndex: 'createdAt',
                render: text => <p>{format('yyyy-MM-dd', text)}</p>,
            }],
        };
    }
    render() {
        const data = this.props.groups;
        return (
            <Table columns={this.state.columns} dataSource={data} />
        );
    }
}

export default SearchGroup;
