import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Tree, Button } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import UserUtil from '../../util/user';

import Avatar from '../components/Avatar';

const Option = Select.Option;
const TreeNode = Tree.TreeNode;

class SelectMembers extends Component {
    static propTypes = {
        chooseUsers: PropTypes.array.isRequired, // 需要选择的人员
        confirmSelected: PropTypes.func.isRequired, // 选择完成后的函数,函数的参数为选中的人员ID
    }
    constructor(...args) {
        super(...args);
        this.state = {
            visible: false,
            expandedKeys: ['0-0-0', '0-0-1'],
            autoExpandParent: true,
            checkedKeys: [],
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
    toggleKeyToUsers = () => this.state.checkedKeys.map((selectId) => {
        const user = this.props.chooseUsers.find(x => x._id === selectId);
        return user;
    })
    renderUserTitle = profile => (
        <div className="team-node user-info">
            <Avatar avatarColor={profile.avatarColor} name={profile.name} avatar={profile.avatar} />
            <p>{profile.name}</p>
        </div>
    )
    renderDevTitle = () => <span className="team-tree-title">商务部(12)</span>
    renderTreeNodes = data => data.map((item) => {
        if (item.company) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode title={this.renderUserTitle(item.profile)} key={item._id} />;
    })
    render() {
        const selectedUsers = this.toggleKeyToUsers();
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
                    <Option value="friends">e建联好友</Option>
                </Select>
                <div>
                    <Tree
                        checkable
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}
                    >
                        {this.renderTreeNodes(this.props.chooseUsers)}
                    </Tree>
                    <div className="selected-avatar">
                        {
                            selectedUsers[0] && selectedUsers.map(user => (
                                user ?
                                    <Avatar key={user._id} avatarColor={user.profile && user.profile.avatarColor} name={user.profile && user.profile.name} avatar={user.profile && user.profile.avatar} />
                                    :
                                    null
                            ))
                        }
                    </div>
                    <div className="btn-wrap">
                        <Button onClick={() => this.props.confirmSelected(this.state.checkedKeys)} type="primary">确定({this.state.checkedKeys.length})</Button>
                    </div>
                </div>
            </div>
        );
    }
}

// export default SelectMembers;

export default withTracker(() => {
    Meteor.subscribe('users');
    const friendIds = UserUtil.getFriends();
    const chooseUsers = friendIds.map(_id => Meteor.users.findOne({ _id }));
    return {
        chooseUsers,
    };
})(SelectMembers);
