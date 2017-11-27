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
            chooseUsers: [],
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
        // Meteor.subscribe('users');
        const selectedOption = this.props.team.filter(x => x.name === value)[0];
        if (selectedOption && selectedOption.members && selectedOption.members.length > 0) {
            const currentMembers = selectedOption.members;
            const chooseUsers = currentMembers.map(_id => Meteor.users.findOne({ _id }, { fields: fields.searchAllUser }));
            this.setState({
                chooseUsers,
            });
        } else {
            console.log('该分组没有好友');
        }
    }
    handleBlur = () => {
        console.log('blur');
    }
    handleFocus = () => {
        console.log('focus');
    }
    toggleKeyToUsers = () => this.state.checkedKeys.map((selectId) => {
        const user = this.state.chooseUsers.find(x => x._id === selectId);
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
        if (item && item.company) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode title={this.renderUserTitle(item.profile)} key={item._id} />;
    },
    )
    render() {
        const selectedUsers = this.toggleKeyToUsers();
        return (
            <div className="select-members">
                <Select
                    showSearch
                    style={{ width: 400 }}
                    // defaultValue="e建联好友"
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
                        {this.renderTreeNodes(this.state.chooseUsers)}
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

export default withTracker(() => {
    Meteor.subscribe('users');
    return {};
})(SelectMembers);
