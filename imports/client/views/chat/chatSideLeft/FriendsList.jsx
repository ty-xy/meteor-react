import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import pinyin from 'pinyin';

import Icon from '../../../components/Icon';
import Avatar from '../../../components/Avatar';
import UserUtil from '../../../../util/user';
import IdUtil from '../../../../util/id';

@pureRender
class FriendsList extends Component {
    static propTypes = {
        users: PropTypes.array,
        changeTo: PropTypes.func,
        handleClick: PropTypes.func,
    };
    render() {
        return (
            <div className="ejianlian-chat-friend-list">
                <div className="chat-friend-pannel">
                    <div className="new-friend-pannel">
                        <p className="new-friend">
                            <Icon icon="icon-icon15" />
                        </p>
                        <p>新的好友</p>
                    </div>
                </div>
                <div className="chat-friend-pannel">
                    {
                        this.props.users.map((item, index) => (
                            item.user && item.user.profile ?
                                <div key={index}>
                                    {
                                        item.showType ?
                                            <div className="friend-pannel-type">
                                                {item.pinyin.toUpperCase()}
                                            </div>
                                            :
                                            null
                                    }
                                    <div
                                        className="friend-pannel-list"
                                        onClick={() => {
                                            this.props.changeTo(IdUtil.merge(Meteor.userId(), item.user._id), item.user._id);
                                            this.props.handleClick();
                                        }}
                                    >
                                        <p className={this.props.users.length - 1 !== index ? 'user-info' : 'user-info user-info-last'}>
                                            <Avatar avatarColor={item.user.profile.avatarColor} name={item.user.profile.name} avatar={item.user.profile.avatar} />
                                        </p>
                                        <p className="friend-name last-type-name">{item.user.profile.name}</p>
                                    </div>
                                </div>
                                :
                                <div key={index}>暂无好友列表</div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('users');
    const friendIds = UserUtil.getFriends();

    const users = friendIds.map(_id => Meteor.users.findOne({ _id }));
    const pinyinData = users.map(user => ({
        user,
        pinyin: pinyin(user.profile.name, {
            style: pinyin.STYLE_FIRST_LETTER,
        },
        )[0][0], // 可以自行选择不同的生成拼音方案和风格。
    }));
    pinyinData.sort((a, b) => a.pinyin.localeCompare(b.pinyin)).map(d => d.han);
    pinyinData.forEach((d, i, data) => {
        d.showType = false;
        if (i) {
            const prev = data[i - 1];
            d.showType = d.pinyin !== prev.pinyin;
        } else {
            d.showType = true;
        }
    });
    return {
        users: pinyinData,
    };
})(FriendsList);
