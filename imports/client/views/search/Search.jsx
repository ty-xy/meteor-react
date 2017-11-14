import React, { Component } from 'react';
import { Icon, Button, Input, Menu, Layout } from 'antd';
import SearchFile from './SearchFile';

const { Content } = Layout;

class Search extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            current: 'all',
        };
    }
    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }
    renderSearchResult = (key) => {
        switch (key) {
        case 'all':
            return <SearchFile />;
        case 'user':
            return <SearchFile />;
        case 'group':
            return <SearchFile />;
        case 'task':
            return <SearchFile />;
        case 'file':
            return <SearchFile />;
        default:
            return <span>未知数据</span>;
        }
    }
    render() {
        return (
            <div className="search-all-wrap">
                <div className="search-all-btn">
                    <Input
                        suffix={(
                            <Button className="search-btn" size="large" >
                                <Icon type="search" />
                            </Button>
                        )}
                    />
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
                        <Menu.Item key="file">
                          文件
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

export default Search;
