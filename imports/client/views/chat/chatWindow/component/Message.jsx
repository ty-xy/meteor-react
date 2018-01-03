import React, { PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import ReactChatView from 'react-chatview';
import { userIdToInfo } from '../../../../../util/user';
import Text from './Text';
import Files from './Files';
import Avatar from '../../../../components/Avatar';
import formatDate from '../../../../../util/formatDate';

class Message extends PureComponent {
	static propTypes = {
        chatGroup: PropTypes.object,
        handleFriendId: PropTypes.func,
        messages: PropTypes.array,
        chatScroll: PropTypes.func,
        users: PropTypes.array,
    }
    constructor(props) {
        super(props);
        const messages = [];
          for (let i = 1; i < 50; i++) {
            messages.push(`${i}_yo`);
          }
        this.state = { messages };
    }
    componentDidUpdate() {
        // this.scrollView.scrollTop = this.scrollView.scrollHeight;
        // const chatview = document.getElementsByClassName('chat-message-list')[0];
        // if (chatview) chatview.scrollTop = chatview.scrollHeight;
    }
    handleChatUser = (fromId, toId, groupId) => {
        console.log('handleChatUser', fromId, toId, groupId);
        if (fromId === Meteor.userId()) {
            return;
        }
        this.props.handleFriendId(fromId);
        // if (toId === groupId) {
        //     // 是一个群里的成员,允许创建临时会话
        //     this.setState({
        //         temporaryChat: true,
        //     });
        //     this.handleFriendId(fromId);
        // }
    }
    renderContent = (type, content) => {
        switch (type) {
        case 'text':
            return <Text content={content} />;
        case 'file':
            return <Files content={content} />;
        default:
            return <span>未知消息</span>;
        }
    }
    render() {
        const groupId = this.props.chatGroup ? this.props.chatGroup._id : '';
        return (
            <ReactChatView
                className="content chat-message-list"
                flipped
                scrollLoadThreshold={50}
                onInfiniteLoad={this.props.chatScroll}
                ref={i => this.scrollView = i}
            >
                {
                    this.props.messages.map(message => (
                        <div
                            key={message._id}
                            className="chat-message"
                        >
                            {
                                message.showYearMonth ?
                                    <div className="message-time">{formatDate.dealMessageTime(message.createdAt)}</div>
                                    :
                                    null
                            }
                            <div className={message.from._id === Meteor.userId() ? 'self-message' : 'message'}>
                                <p className="user-avatar" onClick={() => this.handleChatUser(message.from._id, message.to, groupId)}>
                                    <Avatar
                                        name={userIdToInfo.getName(this.props.users, message.from._id)}
                                        avatarColor={userIdToInfo.getAvatarColor(this.props.users, message.from._id)}
                                        avatar={userIdToInfo.getAvatar(this.props.users, message.from._id)}
                                    />
                                </p>
                                <div className="user-message-wrap">
                                    {
                                        message.from._id !== Meteor.userId() ?
                                            <p className="user-nickname">{message.from.name}</p>
                                            :
                                            null
                                    }
                                    {
                                        this.renderContent(message.type, message.content)
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </ReactChatView>);
      }
}

export default Message;
