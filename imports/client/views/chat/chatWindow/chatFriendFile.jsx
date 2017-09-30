import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import NoticeSideRight from '../../../components/noticeSideRight';

class ChatFriendFile extends Component {
    render() {
        return (
            <div>
                {/* <NoticeSideRight
                    noticeTitle="聊天文件"
                /> */}
                <div className="container-wrap-right">
                    <div className="container-title">
                        聊天文件
                        <i className="icon icon-close-codeBlock icon-close" onClick={this.props.handleFriendFile}>&#xe641;</i>
                    </div>
                    {/* 好友聊天文件 */}
                    <div className="ejianlian-chat-message-list">
                        <div className="file-create-time">
                            2017年2月
                        </div>
                        <div className="chat-user-pannel">
                            <div className="user-avatar">
                                <i className="icon icon-word">&#xe63f;</i>
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
                                <i className="icon">&#xe602;</i>
                            </div>
                        </div>
                        <div className="chat-user-pannel ">
                            <div className="user-avatar">
                                <i className="icon icon-xls">&#xe61a;</i>
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
                                <i className="icon">&#xe602;</i>
                            </div>
                        </div>
                        <div className="file-create-time">
                            2017年1月
                        </div>
                        <div className="chat-user-pannel">
                            <div className="user-avatar">
                                <i className="icon icon-jpg">&#xe60f;</i>
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
                                <i className="icon">&#xe602;</i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
ChatFriendFile.propTypes = {
    handleFriendFile: PropTypes.func,
};
export default ChatFriendFile;
