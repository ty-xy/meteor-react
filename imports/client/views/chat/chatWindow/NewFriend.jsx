import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import format from 'date-format';

import Icon from '../../../components/Icon';
import Avatar from '../../../components/Avatar';
import Notice from '../../../../schema/notice';
import PopulateUtil from '../../../../util/populate';
import feedback from '../../../../util/feedback';
import userInfo from '../../../../util/user';

@pureRender
class NewFriend extends Component {
    static propTypes = {
        newFriendNotice: PropTypes.array,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            hasNewFriend: false,
        };
    }
    compare = property => (a, b) => b[property] - a[property];
    dealNotice = async (noticeId, index, friendId, user) => {
        console.log(111);
        Meteor.call('dealFriendNotice', noticeId, index, (err) => {
            console.log(err);
        });
        if (index === 1) {
            Meteor.call('addFriend', friendId, (err) => {
                if (err) {
                    console.error(err.reason);
                }
            });
            try {
                // 注意判断选中的人是否包含Meter.userId()
                const members = [Meteor.userId(), friendId];
                const name = Meteor.user() ? user : userInfo.getName();
                const result = await Meteor.callPromise('createGroup', {
                    name,
                    members,
                    type: 'user',
                });
                console.log(result);
                // await this.props.changeTo(result, result, '', 'message');
                // await this.props.handleToggle(result);
                await this.handleAddGroup();
                feedback.dealSuccess('成功创建群聊');
            } catch (err) {
                feedback.dealError(err);
            }
        }
    }
    deleteNotice = (noticeId) => {
        Meteor.call('deleteFriendNotice', noticeId, (err) => {
            console.log(err);
        });
    }
    renderRefuseFriend = (item, index) => (
        <div className="new-friend-pannel" key={index}>
            <Icon icon="icon-chuyidong" size={20} onClick={() => this.deleteNotice(item._id)} />
            <Avatar name={item.noticeTo.profile.name} avatarColor={item.noticeTo.profile.avatarColor} />
            <div className="friend-info">
                <p>{item.noticeTo.profile.name} &nbsp; {format('yyyy-MM-dd', item.createdAt)}</p>
                <p>该用户拒绝添加您为好友</p>
            </div>

            <div className="friend-refuse">
            被拒绝
            </div>
        </div>
    )
    renderFriendNotice = (item, index) => {
        console.log(11111111);
        return (<div className="new-friend-pannel" key={index}>
            <Icon icon="icon-chuyidong" size={20} onClick={() => this.deleteNotice(item._id)} />
            <Avatar name={item.noticeFrom.profile.name} avatarColor={item.noticeFrom.profile.avatarColor} />
            <div className="friend-info">
                <p>{item.noticeFrom.profile.name} &nbsp; {format('yyyy-MM-dd', item.createdAt)}</p>
                <p>{item.noticeContent ? item.noticeContent : `${item.noticeFrom.profile.name}请求添加您为好友`}</p>
            </div>
            {
                item.dealResult === 0 ?
                    <div className="friend-confirm">
                        <button className="accept" onClick={this.dealNotice.bind(this, item._id, 1, item.from, item.noticeFrom.profile.name)}>接受</button>
                        <button className="refuse" onClick={this.dealNotice.bind(this, item._id, 2)}>拒绝</button>
                    </div>
                    : (item.dealResult === 1 ?
                        <button className="confirmed">已接受</button>
                        :
                        <button className="confirmed">已拒绝</button>
                    )
            }
        </div>);
    }
    render() {
        const renderFriendList = this.props.newFriendNotice.sort(this.compare('createdAt'));
        return (
            <div className="ejianlian-chat-window ejianlian-new-friend">
                <div className="chat-to-user">
                    新的好友
                </div>
                <div className="list">
                    {
                        renderFriendList.length > 0 ?
                            <div className="new-friend">
                                {renderFriendList.map((item, index) => (
                                    item.to === Meteor.userId() ?
                                        this.renderFriendNotice(item, index)
                                        :
                                        this.renderRefuseFriend(item, index)
                                ))}
                            </div>
                            :
                            <div className="no-content">
                                暂无新的好友
                            </div>
                    }


                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('notice');
    // 找出别人向你发起的好友认证
    const friendNotice = Notice.find({ type: 0, to: Meteor.userId() }).fetch();
    friendNotice.forEach((x) => {
        x.noticeFrom = PopulateUtil.user(x.from) || {};
    });
    // 找出你向别人,然后别人拒绝你的好友认证
    const refuseFriend = Notice.find({ type: 0, from: Meteor.userId(), dealResult: 2 }).fetch();
    refuseFriend.forEach((x) => {
        x.noticeTo = PopulateUtil.user(x.to) || {};
    });
    const newFriendNotice = [...friendNotice, ...refuseFriend];
    console.log(newFriendNotice, Meteor.userId());
    return {
        newFriendNotice,
    };
})(NewFriend);

