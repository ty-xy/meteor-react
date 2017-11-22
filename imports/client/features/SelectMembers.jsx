import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Tree } from 'antd';

import Avatar from '../components/Avatar';

const Option = Select.Option;
const TreeNode = Tree.TreeNode;

const treeData = [{
    title: <span className="team-tree-title">商务部(12)</span>,
    key: '0-0',
    children: [{
        title: <div className="team-node user-info">
            <Avatar avatarColor="red" name="亚星" avatar="" />
            <p>王亚星</p>
        </div>,
        key: '0-0-0',
    }, {
        title: <div className="team-node user-info">
            <Avatar avatarColor="red" name="亚星" avatar="" />
            <p>王亚星</p>
        </div>,
        key: '0-0-1',
    }, {
        title: <div className="team-node user-info">
            <Avatar avatarColor="red" name="亚星" avatar="" />
            <p>王亚星</p>
        </div>,
        key: '0-0-2',
    }],
}, {
    title: <span className="team-tree-title">人事部(12)</span>,
    key: '0-1',
    children: [
        { title: '0-1-0-0', key: '0-1-0-0' },
        { title: '0-1-0-1', key: '0-1-0-1' },
        { title: '0-1-0-2', key: '0-1-0-2' },
    ],
}, {
    title: <div className="team-node user-info">
        <Avatar avatarColor="red" name="亚星" avatar="" />
        <p>王亚星</p>
    </div>,
    key: '0-2',
}];
class SelectMembers extends Component {
    static PropTypes = {
        select: PropTypes.array,
        closeSelect: PropTypes.func.isRequired,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            visible: false,
            expandedKeys: ['0-0-0', '0-0-1'],
            autoExpandParent: true,
            checkedKeys: ['0-0-0'],
            selectedKeys: [],
        };
    }


    onExpand = (expandedKeys) => {
        console.log('onExpand', arguments);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    }
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    }
    handleChange = (value) => {
        console.log(`selected ${value}`);
    }
    handleBlur = () => {
        console.log('blur');
    }
    handleFocus = () => {
        console.log('focus');
    }

    renderTreeNodes = data => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} />;
    })
    render() {
        return (
            <div className="select-members">
                <Select
                    showSearch
                    style={{ width: 400 }}
                    defaultValue="e建联好友"
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    <Option value="jack">e建联好友</Option>
                    <Option value="lucy">中艺装饰</Option>
                    <Option value="tom">中艺装饰设计部</Option>
                </Select>
                <div>
                    <Tree
                        checkable
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}
                        onSelect={this.onSelect}
                        selectedKeys={this.state.selectedKeys}
                    >
                        {this.renderTreeNodes(treeData)}
                    </Tree>
                </div>
            </div>
        );
    }
}

export default SelectMembers;
