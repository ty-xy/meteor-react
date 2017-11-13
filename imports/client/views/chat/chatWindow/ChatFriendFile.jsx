import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import format from 'date-format';

import Icon from '../../../components/Icon';
import FileIcon from '../../../components/FileIcon';

@pureRender
class ChatFriendFile extends Component {
    static propTypes = {
        files: PropTypes.array,
        handleFriendFile: PropTypes.func,
    }
    render() {
        return (
            <div className="container-wrap">
                <div className="opacity" onClick={this.props.handleFriendFile} />
                <div className="container-wrap-right">
                    <div className="container-title">
                        聊天文件
                        <Icon icon="icon-guanbi icon-close" onClick={this.props.handleFriendFile} size={20} />
                    </div>
                    <div className="chat-message-file-wrap">
                        {
                            this.props.files.length > 0 ?
                                this.props.files.map((item, index) =>
                                    (
                                        <div className="ejianlian-chat-message-list" key={index}>
                                            {
                                                item.showYearMonth ?
                                                    <div className="file-create-time">
                                                        {format('yyyy年MM月', item.createdAt)}
                                                    </div>
                                                    :
                                                    null
                                            }
                                            <div className="chat-user-pannel">
                                                <div className="user-avatar">
                                                    <FileIcon type={item.type} />
                                                </div>
                                                <div className="user-message">
                                                    <p>{item.name}</p>
                                                    <p className="last-message">
                                                        <span>来自{item.fileFrom} &nbsp;</span>
                                                        <span>{format('yyyy-MM-dd ', item.createdAt)} &nbsp;</span>
                                                        <span>{item.size}</span>
                                                    </p>
                                                </div>
                                                <div className="download-icon">
                                                    <a href={item.url} download>
                                                        <Icon icon="icon-xiazai icon" size={18} />
                                                    </a>

                                                </div>
                                            </div>
                                        </div>),
                                )
                                :
                                <div className="no-content">暂无聊天文件</div>

                        }
                    </div>


                </div>
            </div>
        );
    }
}

export default ChatFriendFile;

