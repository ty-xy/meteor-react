import React, { Component } from 'react';
import { Icon, Input, AutoComplete } from 'antd';

import Avatar from '../components/Avatar';

const Option = AutoComplete.Option;
const OptGroup = AutoComplete.OptGroup;

class SearchChat extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            dataSource: [{
                title: '好友',
                children: [{
                    title: 'AntDesign 是一',
                    count: 10000,
                    name: '哈哈',
                    color: '#29b6f6',
                }, {
                    title: 'AntDesign 设计语言',
                    count: 10600,
                    name: '啦啦',
                    color: '#f58f47',
                }],
            }, {
                title: '群组',
                children: [{
                    title: '是一个设计语言',
                    count: 60100,
                    name: '哈哈',
                    color: '#29b6f6',
                }, {
                    title: 'AntDe 是一个设计语言',
                    count: 30010,
                    name: '哈哈',
                    color: '#29b6f6',
                }],
            }, {
                title: '聊天记录',
                children: [{
                    title: 'AntDes计语言',
                    count: 100000,
                    name: '哈哈',
                    color: '#29b6f6',
                }],
            }],
        };
    }
    renderTitle = (title, count) => (
        <span>
            {title}
            <a
                style={{ float: 'right' }}
                href="https://www.google.com/search?q=antd"
                target="_blank"
                rel="noopener noreferrer"
            >{count}
            </a>
        </span>
    )
    renderOptions = () => this.state.dataSource.map(group => (
        <OptGroup
            key={group.title}
            label={this.renderTitle(group.title, group.children.length)}
        >
            {group.children.map(opt => (
                <Option key={opt.title} value={opt.title}>
                    <div style={{ display: 'flex' }}>
                        <Avatar name={opt.name} avatarColor={opt.color} />
                        <div style={{ marginTop: 10, marginLeft: 10 }}>哈哈</div>

                    </div>


                </Option>
            ))}
        </OptGroup>
    )).concat([
        <Option disabled key="all" className="show-all">
            <a
                href="https://www.google.com/search?q=antd"
                target="_blank"
                rel="noopener noreferrer"
            >
                查看所有结果
            </a>
        </Option>,
    ])
    render() {
        return (
            <div className="certain-category-search-wrapper">
                <AutoComplete
                    className="certain-category-search"
                    dropdownClassName="certain-category-search-dropdown"
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: 300 }}
                    size="large"
                    style={{ width: '100%' }}
                    dataSource={this.renderOptions()}
                    placeholder="好友,群组,聊天记录"
                    optionLabelProp="value"
                >
                    <Input suffix={<Icon type="search" className="certain-category-icon" />} ref={i => this.$message = i} />
                </AutoComplete>
            </div>
        );
    }
}

export default SearchChat;
