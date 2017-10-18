import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { Select } from 'antd';

import Icon from '../../../../components/Icon';
import Avatar from '../../../../components/Avatar';
import UserUtil from '../../../../../util/user';

const Option = Select.Option;
@pureRender
class AddGroup extends Component {
    static propTypes = {
        isShowAddGroup: PropTypes.bool,
        handleAddGroup: PropTypes.func,
        users: PropTypes.array,
    };
    constructor(...args) {
        super(...args);
        this.state = {
            selected: {},
        };
    }
    getSelectedUsers = () => {
        const selectedIds = Object.keys(this.state.selected).filter(id => this.state.selected[id]);
        return selectedIds.map((selectId) => {
            const user = this.props.users.find(x => x._id === selectId);
            return user;
        });
    }
    handleChange = (value) => {
        console.log(`selected ${value}`);
    }
    handleToggle = (value) => {
        this.setState({
            selected: Object.assign({}, this.state.selected, {
                [value]: !this.state.selected[value],
            }),
        });
    }
    createGroup = () => {
        const selectedUsers = [Meteor.user(), ...this.getSelectedUsers()];
        const forwardFourUsers = selectedUsers.slice(0, 4);
        let groupName = forwardFourUsers.reduce((name, user) => `${name}、${user.profile.name}`, '');
        groupName = groupName.slice(1, groupName.length);
        Meteor.call(
            'createGroup',
            {
                name: groupName,
                members: selectedUsers.map(user => user._id),
            },
            (err) => {
                if (err) {
                    return console.error(err.reason);
                }
            },
        );
    }
    render() {
        const selectedUsers = this.getSelectedUsers();
        return (
            <div className="container-wrap add-group-block" style={{ display: this.props.isShowAddGroup ? 'block' : 'none' }}>
                <div className="container-middle container-content">
                    <div className="container-title">
                        发起群聊
                        <Icon icon="icon-guanbi icon icon-close-addGroup icon-close" onClick={this.props.handleAddGroup} />
                    </div>
                    <Select defaultValue="e建联好友" onChange={this.handleChange} className="select-group-item">
                        <Option value="jack">e建联好友</Option>
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
                                <Avatar key={index} avatarColor={user.profile.avatarColor} name={user.profile.name} avatar={user.profile.avatar} />
                            ))
                        }
                    </div>
                    <div>
                        <div className="confirm-btn" onClick={this.createGroup}>
                            确定({selectedUsers.length})
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}


export default withTracker(() => {
    Meteor.subscribe('users');
    const friendIds = UserUtil.getFriends();
    const users = friendIds.map(_id => Meteor.users.findOne({ _id }));
    return {
        users,
    };
})(AddGroup);
