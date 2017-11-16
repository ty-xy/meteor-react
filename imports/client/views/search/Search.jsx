import React, { Component } from 'react';
import { Input, Menu, Layout } from 'antd';
import { Meteor } from 'meteor/meteor';

import SearchTask from './SearchTask';
import SearchUser from './SearchUser';
import SearchGroup from './SearchGroup';
import UserUtil from '../../../util/user';

const { Content } = Layout;
const Search = Input.Search;

class SearchAll extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            current: 'all',
            friends: [],
            groups: [],
            tasks: [],
        };
    }
    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }
    searchAll = (value) => {
        this.setState({
            searchValue: value,
        });
        Meteor.call('search', value, async (err, result) => {
            const { friends, groups, tasks } = result;
            friends.forEach(x => x.key = x._id);
            groups.forEach((x) => {
                x.key = x._id;
                x.profile = {
                    name: x.name,
                    avatar: x.avatar,
                };
                x.adminName = UserUtil.getName();
            });
            tasks.forEach((x) => {
                x.key = x._id;
                x.createdName = UserUtil.getName();
            });
            this.setState({
                friends,
                groups,
                tasks,
            });
        });
    }
    renderSearchResult = (key) => {
        switch (key) {
        case 'all':
            return <SearchTask />;
        case 'user':
            return <SearchUser friends={this.state.friends} />;
        case 'group':
            return <SearchGroup />;
        case 'task':
            return <SearchTask />;
        default:
            return <span>未知数据</span>;
        }
    }
    render() {
        return (
            <div className="search-all-wrap">
                <div className="search-all-btn">
                    <Search onSearch={this.searchAll} />
                </div>
                <div className="search-result">
                    <Menu
                        onClick={this.handleClick}
                        selectedKeys={[this.state.current]}
                        mode="horizontal"
                    >
                        <Menu.Item key="all">
                            全部
                        </Menu.Item>
                        <Menu.Item key="user">
                            用户
                        </Menu.Item>
                        <Menu.Item key="group">
                            群组
                        </Menu.Item>
                        <Menu.Item key="task">
                          任务
                        </Menu.Item>
                    </Menu>
                    <Content>
                        {
                            this.renderSearchResult(this.state.current)
                        }
                    </Content>
                </div>
            </div>
        );
    }
}

export default SearchAll;
