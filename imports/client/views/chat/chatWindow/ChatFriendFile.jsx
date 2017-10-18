import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

import Icon from '../../../components/Icon';

@pureRender
class ChatFriendFile extends Component {
    static propTypes = {
        handleFriendFile: PropTypes.func,
    };
    render() {
        return (
            <div>
                <div className="container-wrap-right">
                    <div className="container-title">
                        聊天文件
                        <Icon icon="icon-guanbi icon icon-close-codeBlock icon-close" onClick={this.props.handleFriendFile} />
                    </div>
                    {/* 好友聊天文件 */}
                    <div className="ejianlian-chat-message-list">
                        <div className="file-create-time">
                            2017年2月
                        </div>
                        <div className="chat-user-pannel">
                            <div className="user-avatar">
                                <Icon icon="icon-word icon" />
                            </div>
                            <div className="user-message">
                                <p>#817项目招标文件.docx</p>
                                <p className="last-message">
                                    <span>来自周小妹 &nbsp;</span>
                                    <span>2017-02-20 &nbsp;</span>
                                    <span>100KB</span>
                                </p>
                            </div>
                            <div className="download-icon">
                                <Icon icon="icon-xiazai icon" />
                            </div>
                        </div>
                        <div className="chat-user-pannel ">
                            <div className="user-avatar">
                                <Icon icon="icon-xls icon" />
                            </div>
                            <div className="user-message">
                                <p>#817项目报表.xls</p>
                                <p className="last-message">
                                    <span>来自周小妹 &nbsp;</span>
                                    <span>2017-02-20 &nbsp;</span>
                                    <span>100KB</span>
                                </p>
                            </div>
                            <div className="download-icon">
                                <Icon icon="icon-xiazai icon" />
                            </div>
                        </div>
                        <div className="file-create-time">
                            2017年1月
                        </div>
                        <div className="chat-user-pannel">
                            <div className="user-avatar">
                                <Icon icon="icon-jpg icon" />
                            </div>
                            <div className="user-message">
                                <p>#817项目效果图演示.jpg</p>
                                <p className="last-message">
                                    <span>来自周小妹 &nbsp;</span>
                                    <span>2017-02-20 &nbsp;</span>
                                    <span>100KB</span>
                                </p>
                            </div>
                            <div className="download-icon">
                                <Icon icon="icon-xiazai icon" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatFriendFile;
