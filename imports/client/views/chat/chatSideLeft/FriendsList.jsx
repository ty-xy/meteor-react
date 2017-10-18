import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import Icon from '../../../components/Icon';
import Avatar from '../../../components/Avatar';
import UserUtil from '../../../../util/user';

@pureRender
class FriendsList extends Component {
    static propTypes = {
        users: PropTypes.array,
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
                    <div className="friend-pannel-type">
                        A
                    </div>
                    {
                        this.props.users.map((item, index) => (
                            item && item.profile ?
                                <div
                                    key={index}
                                    className="friend-pannel-list"
                                >

                                    <p className={this.props.users.length - 1 !== index ? 'user-info' : 'user-info user-info-last'}>
                                        <Avatar avatarColor={item.profile.avatarColor} name={item.profile.name} avatar={item.profile.avatar} />
                                    </p>
                                    <p className="friend-name last-type-name">{item.profile.name}</p>
                                </div>
                                :
                                <div key={index}>暂无好友列表</div>
                        ))
                    }
                    {/* <div className="friend-pannel-list">
                        <div className="friend-list-item">
                            <p>
                                <img src="http://img.duoziwang.com/2016/10/02/15235311191.jpg" alt="" />
                            </p>
                            <p className="friend-name">安大哥</p>
                        </div>
                        <div className="friend-list-item">
                            <p>
                                <img src="http://img2.imgtn.bdimg.com/it/u=2273251608,3871271086&fm=214&gp=0.jpg" alt="" />
                            </p>
                            <p className="friend-name last-type-name">安大哥</p>
                        </div>
                    </div> */}
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('users');
    const friendIds = UserUtil.getFriends();

    const users = friendIds.map(_id => Meteor.users.findOne({ _id }));
    console.log(111, users);
    return {
        users,
    };
})(FriendsList);
