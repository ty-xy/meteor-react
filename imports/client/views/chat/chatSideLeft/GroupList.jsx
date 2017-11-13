import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import Icon from '../../../components/Icon';
import Avatar from '../../../components/Avatar';
import UserUtil from '../../../../util/user';
import Group from '../../../../schema/group';

@pureRender
class GroupList extends Component {
    static propTypes = {
        groups: PropTypes.array,
        changeTo: PropTypes.func,
        handleClick: PropTypes.func,
    };
    constructor(...args) {
        super(...args);
        this.state = {
            isShowCompany: false,
            isShowMyGroup: false,
        };
    }
    handleShowCompany = () => {
        this.setState({
            isShowCompany: !this.state.isShowCompany,
        });
    }
    handleShowMyGroup = () => {
        this.setState({
            isShowMyGroup: !this.state.isShowMyGroup,
        });
    }
    render() {
        return (
            <div className="ejianlian-chat-group-list">
                <div className="chat-friend-pannel">
                    <div className="friend-pannel-type" />
                    <div className="friend-pannel-list">
                        <div className="friend-list-item">
                            <p className="my-chat-group">
                                <Icon icon="icon-qunzu icon" />
                            </p>
                            <p className="friend-name" style={{ borderWidth: this.state.isShowMyGroup ? '0px' : this.props.groups.length > 0 ? '1px' : '0px' }}>
                                我的群聊
                                {
                                    this.state.isShowMyGroup ?
                                        <Icon icon="icon-xiangshangjiantou-copy-copy-copy icon" onClick={this.handleShowMyGroup} />
                                        :
                                        <Icon icon="icon-jiantou-copy icon" onClick={this.handleShowMyGroup} />
                                }
                            </p>
                        </div>
                        <div style={{ display: this.state.isShowMyGroup ? 'none' : 'block' }}>
                            {
                                this.props.groups.map((item, index) => (
                                    item ?
                                        <div
                                            key={index}
                                            className="friend-list-item"
                                            onClick={() => {
                                                this.props.handleClick();
                                                this.props.changeTo(item._id, item._id, 'groupId');
                                            }}
                                        >
                                            <p>
                                                <Avatar name={item.name} avatar={item.avatar ? item.avatar : 'http://oxldjnom8.bkt.clouddn.com/groupAvatar.png'} />
                                            </p>
                                            <p className={this.props.groups.length - 1 !== index ? 'friend-name' : 'friend-name last-type-name'}>{item.name}</p>
                                        </div>
                                        :
                                        null
                                ),
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('group');
    const groupIds = UserUtil.getGroups();

    const groups = groupIds.map(_id => Group.findOne({ _id }));
    return {
        groups,
    };
})(GroupList);
