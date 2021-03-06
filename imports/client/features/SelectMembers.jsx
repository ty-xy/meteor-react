import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, Tree, Button } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

// import UserUtil from '../../util/user';

import Avatar from '../components/Avatar';
import fields from '../../util/fields';

const Option = Select.Option;
const TreeNode = Tree.TreeNode;

class SelectMembers extends Component {
    static propTypes = {
        // isRadio: 单选还是多选
        team: PropTypes.array.isRequired, // 需要选择的人员
        confirmSelected: PropTypes.func.isRequired, // 选择完成后的函数,函数的参数为选中的人员ID
    }
    constructor(...args) {
        super(...args);
        this.state = {
            visible: false,
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
            allKeys: {}, // 不能有同名群组
            chooseUsers: [],
            selectedTitle: this.props.team[0].name || '',
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
        const newAllKeys = JSON.parse(JSON.stringify(this.state.allKeys));
        const oldSlectedTitleCheckedKeys = newAllKeys[this.state.selectedTitle] || [];
        const addedKeys = [];
        const deletedKeys = [];
        for (const key of oldSlectedTitleCheckedKeys) {
            if (!checkedKeys.includes(key)) {
                deletedKeys.push(key);
            }
        }
        for (const key of checkedKeys) {
            if (!/^\$\$/.test(key) && !oldSlectedTitleCheckedKeys.includes(key)) {
                addedKeys.push(key);
            }
        }
        for (const key of addedKeys) {
            for (const team of this.props.team) {
                if (team.name === this.state.selectedTitle) {
                    newAllKeys[team.name] = newAllKeys[team.name] || [];
                    newAllKeys[team.name].push(key);
                } else if (team.name !== this.state.selectedTitle && team.members.includes(key)) {
                    newAllKeys[team.name] = newAllKeys[team.name] || [];
                    newAllKeys[team.name].push(key);
                }
            }
        }
        for (const key of deletedKeys) {
            for (const team of this.props.team) {
                if (team.name === this.state.selectedKeys) {
                    newAllKeys[team.name] = newAllKeys[team.name] || [];
                    const index = newAllKeys[team.name].indexOf(key);
                    if (index !== -1) {
                        newAllKeys[team.name].splice(index, 1);
                    }
                } else if (team.name !== this.state.selectedKeys && team.members.includes(key)) {
                    newAllKeys[team.name] = newAllKeys[team.name] || [];
                    const index = newAllKeys[team.name].indexOf(key);
                    if (index !== -1) {
                        newAllKeys[team.name].splice(index, 1);
                    }
                }
            }
        }
        let keys = [];
        for (const title of Object.keys(newAllKeys)) {
            keys.push(...newAllKeys[title]);
        }
        keys = keys.filter((x, i) => keys.indexOf(x) === i); // 去重
        this.setState({ checkedKeys: keys, allKeys: newAllKeys });
    }
    handleChange = (value) => {
        console.log(`selected ${value}`);
        const newCheckedKeys = JSON.parse(JSON.stringify(this.state.checkedKeys));
        this.setState({
            selectedTitle: value,
            checkedKeys: newCheckedKeys,
        });
    }
    toggleKeyToUsers = () => this.state.checkedKeys.map((selectId) => {
        const user = Meteor.users.findOne({ _id: selectId }, { fields: fields.searchAllUser });
        return user;
    })
    dealSelectedData = (value) => {
        const selectedOption = this.props.team.filter(x => x.name === value)[0];
        // 如果是存在部门
        if (selectedOption.department.length) {
            if (selectedOption.members.length) {
                const members = [];
                for (const department of selectedOption.department) {
                    for (const member of department.members) {
                        members.push(member);
                    }
                }
                return [
                    this.renderDepartments(selectedOption.department),
                    this.renderUsers(selectedOption.members.filter(x => members.indexOf(x) === -1)),
                ];
            }
            return this.renderDepartments(selectedOption.department);
        }
        // 没有部门的情况
        if (selectedOption && selectedOption.members && selectedOption.members.length > 0) {
            return this.renderUsers(selectedOption.members);
        }
        // 部门和没有部门的情况都存在
        console.log('该分组没有好友');
    }
    renderUsers = (currentMembers) => {
        const chooseUsers = currentMembers.map(_id => Meteor.users.findOne({ _id }, { fields: fields.searchAllUser }));
        return this.renderTreeNodes(chooseUsers);
    }
    renderDepartments = (currentDepartment) => {
        // 过滤掉存在部门但是部门里面没有人的情况
        const result = currentDepartment.filter(x => x.members[0]);
        result.forEach((x) => {
            x.user = x.members.map(_id => Meteor.users.findOne({ _id }, { fields: fields.searchAllUser }));
        });
        return result.map(item => (<TreeNode title={`${item.name}(${item.user.length})`} key={`$$${item.name}`} dataRef={item}>
            {this.renderTreeNodes(item.user)}
        </TreeNode>));
    }
    renderUserTitle = profile => (
        <div className="team-node user-info">
            <Avatar avatarColor={profile.avatarColor} name={profile.name} avatar={profile.avatar} />
            <p>{profile.name}</p>
        </div>
    )
    renderTreeNodes = data => data.map(item =>
        <TreeNode title={this.renderUserTitle(item.profile)} key={item._id} />,
    )
    render() {
        // console.log(this.state.checkedKeys, this.state.allKeys);
        const selectedUsers = this.toggleKeyToUsers();
        return (
            <div className="select-members">
                <Select
                    showSearch
                    style={{ width: 400 }}
                    defaultValue={this.props.team[0].name}
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {
                        this.props.team.map(item => (
                            <Option value={item.name} key={item.name}>{item.name}</Option>
                        ))
                    }

                </Select>
                <div>
                    <Tree
                        checkable
                        onCheck={this.onCheck}
                        checkedKeys={this.state.checkedKeys}
                    >
                        {this.dealSelectedData(this.state.selectedTitle)}
                    </Tree>
                    <div className="selected-avatar">
                        {
                            selectedUsers[0] && selectedUsers.map(user => (
                                user && user.profile ?
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

export default withTracker(() => {
    Meteor.subscribe('users');
    return {};
})(SelectMembers);
