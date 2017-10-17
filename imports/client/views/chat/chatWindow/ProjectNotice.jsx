import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';

import Icon from '../../../components/Icon';
import Avatar from '../../../components/Avatar';


@pureRender
class ProjectNotice extends Component {
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
                    项目通知
                    <div className="chat-other-account">
                        <p>
                            <Icon icon="icon-shaixuan icon" />
                        </p>
                        <p>
                            <Icon icon="icon-tongzhi2 icon" onClick={this.handleFriendInfo} />
                        </p>
                    </div>
                </div>
                <div className="list">
                    {/* <div className="no-list">
                        暂无项目通知
                    </div> */}
                    <div className="new-friend">
                        <div className="new-friend-pannel">
                            <Avatar name="好友" avatarColor="#7ED321" />
                            <div className="friend-info">
                                <p>来自团队 中艺装饰</p>
                                <p><span>@周小妹</span>完成了任务，<span>#B12项目资料汇总</span></p>
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

export default ProjectNotice;
