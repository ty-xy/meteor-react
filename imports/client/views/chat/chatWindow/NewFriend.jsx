import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';

import Icon from '../../../components/Icon';
import Avatar from '../../../components/Avatar';


@pureRender
class NewFriend extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            hasNewFriend: false,
        };
    }
    render() {
        return (
            <div className="ejianlian-chat-window ejianlian-new-friend">
                <div className="chat-to-user">
                    新的好友
                    <div className="chat-other-account">
                        <p>
                            <Icon icon="icon-bianji1 icon" />
                        </p>
                    </div>
                </div>
                <div className="list">
                    {/* <div className="no-list">
                        暂无新的好友
                    </div> */}
                    <div className="new-friend">
                        <div className="new-friend-pannel">
                            <Avatar name="好友" avatarColor="#7ED321" />
                            <div className="friend-info">
                                <p>好友</p>
                                <p>我是王亚星我是王亚星我是王亚星我是王亚星</p>
                            </div>
                            <div className="friend-confirm">
                                <button className="accept">接受</button>
                                <button className="refuse">拒绝</button>
                            </div>
                        </div>
                        <div className="new-friend-pannel">
                            <Avatar name="好友" avatarColor="#7ED321" />
                            <div className="friend-info">
                                <p>好友</p>
                                <p>我是王亚星我是王亚星我是王亚星我是王亚星</p>
                            </div>
                            <div className="friend-confirm">
                                <button className="confirmed">已拒绝</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewFriend;

