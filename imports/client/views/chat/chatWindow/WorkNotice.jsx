import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';

import Icon from '../../../components/Icon';
import Avatar from '../../../components/Avatar';


@pureRender
class WorkNotice extends Component {
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
                    工作通知
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
                                <p>来自团队 中艺装饰的—「日志」 </p>
                                <p><span>@周小妹</span>向您提交了周报，<span>点击前往查看</span></p>
                            </div>
                            <div className="time">
                        09:30
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default WorkNotice;
