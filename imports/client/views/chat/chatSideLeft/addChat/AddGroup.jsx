import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { Select } from 'antd';

import Icon from '../../../../components/Icon';
import Avatar from '../../../../components/Avatar';

import feedback from '../../../../../util/feedback';

const Option = Select.Option;
@pureRender
class AddGroup extends Component {
    static propTypes = {
        isShowAddGroup: PropTypes.bool,
        handleAddGroup: PropTypes.func,
        users: PropTypes.array,
        type: PropTypes.string,
        groupId: PropTypes.string,
        changeTo: PropTypes.func,
        handleToggle: PropTypes.func,
        // isEditGroupName: PropTypes.bool,
        // members: PropTypes.array,
    };
    constructor(...args) {
        super(...args);
        this.state = {
            selected: {},
        };
    }
    // 获取选中的好友
    getSelectedUsers = () => {
        const selectedIds = Object.keys(this.state.selected).filter(id => this.state.selected[id]);
        return selectedIds.map((selectId) => {
            const user = this.props.users.find(x => x._id === selectId);
            return user;
        });
    }
    // 取前四个群成员的名字为群默认昵称
    getFourUsers = (arr) => {
        if (arr) {
            const forwardFourUsers = arr.slice(0, 4);
            let groupName = forwardFourUsers.reduce((name, user) => `${name}、${user.profile.name}`, '');
            groupName = groupName.slice(1, groupName.length);
            return groupName;
        }
    }
    handleChange = (value) => {
        console.log(`selected ${value}`);
    }
    // 点击按钮,选择或取消选择
    handleToggle = (value) => {
        this.setState({
            selected: Object.assign({}, this.state.selected, {
                [value]: !this.state.selected[value],
            }),
        });
    }
    createGroup = () => {
        const selectedUsers = [Meteor.user(), ...this.getSelectedUsers()];
        Meteor.call(
            'createGroup',
            {
                name: `由${Meteor.user().profile.name}发起的群聊`,
                members: selectedUsers.map(user => user._id),
            },
            (err, result) => {
                if (result) {
                    this.props.changeTo(result, result);
                    this.props.handleToggle(result);
                    feedback.dealSuccess('成功创建群聊');
                    this.props.handleAddGroup();
                    this.setState({
                        selected: {},
                    });
                }

                feedback.dealError(err);
            },
        );
    }
    addGroupMembers = () => {
        const selectedUsers = [...this.getSelectedUsers()];
        // if (this.props.isEditGroupName) {
        //     const newMembers = this.props.members.concat(this.getSelectedUsers());
        //     Meteor.call(
        //         'changeGroupName',
        //         {
        //             groupId: this.props.groupId,
        //             name: this.getFourUsers(newMembers),
        //         },
        //         (err) => {
        //             feedback.dealError(err);
        //             this.setState({
        //                 selected: {},
        //             });
        //         },
        //     );
        // }
        Meteor.call(
            'addGroupMembers',
            {
                groupId: this.props.groupId,
                newMembers: selectedUsers.map(user => user._id),
            },
            (err) => {
                feedback.dealError(err);
                feedback.dealSuccess('邀请好友成功');
                this.setState({
                    selected: {},
                });
                this.props.handleAddGroup();
            },
        );
    }
    handleConfirmGroup = () => {
        if (this.props.type === 'createGroup') {
            this.createGroup();
        } else if (this.props.type === 'addMember') {
            this.addGroupMembers();
        } else {
            console.log(this.props.type);
        }
    }
    render() {
        const selectedUsers = this.getSelectedUsers();
        return (
            <div className="container-wrap add-group-block" style={{ display: this.props.isShowAddGroup ? 'block' : 'none' }}>
                <div className="container-middle container-content">
                    <div className="container-title">
                        {
                            this.props.type === 'createGroup' ? '发起群聊' : '邀请好友'
                        }
                        <Icon icon="icon-guanbi icon icon-close-addGroup icon-close" onClick={this.props.handleAddGroup} />
                    </div>
                    <Select defaultValue="e建联好友" onChange={this.handleChange} className="select-group-item">
                        <Option value="jack" >e建联好友</Option>
                    </Select>
                    <ul className="select-group-list">
                        {
                            this.props.users.map((item, index) => (
                                item && item.profile ?
                                    <li
                                        key={index}
                                        className="group-user-item"
                                        onClick={this.handleToggle.bind(this, item._id)}
                                    >
                                        <p className="checkbox">
                                            {
                                                this.state.selected && this.state.selected[item._id] ?
                                                    <Icon icon="icon-chuangyikongjianICON_fuzhi- icon" />
                                                    :
                                                    <Icon icon="icon-weixuanzhong icon" />

                                            }
                                        </p>
                                        <p className={this.props.users.length - 1 !== index ? 'user-info' : 'user-info user-info-last'}>
                                            <Avatar avatarColor={item.profile.avatarColor} name={item.profile.name} avatar={item.profile.avatar} />
                                            {item.profile.name}
                                        </p>
                                    </li>
                                    :
                                    <div key={index}>暂无好友</div>
                            ))
                        }
                    </ul>
                    <div className="selected-avatar">
                        {
                            selectedUsers.map((user, index) => (
                                user ?
                                    <Avatar key={index} avatarColor={user.profile.avatarColor} name={user.profile.name} avatar={user.profile.avatar} />
                                    :
                                    null
                            ))
                        }
                    </div>
                    <div>
                        <div className="confirm-btn" onClick={this.handleConfirmGroup}>
                            确定({selectedUsers.length})
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}


export default AddGroup;
