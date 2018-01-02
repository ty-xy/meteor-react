import React, { PureComponent } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import formatDate from '../../../../../util/formatDate';
import { userIdToInfo } from '../../../../../util/user';
import Text from './Text';
import Files from './Files';
import Avatar from '../../../../components/Avatar';

class Message extends PureComponent {
	static propTypes = {
        chatGroup: PropTypes.object,
        handleFriendId: PropTypes.func,
        messages: PropTypes.array,
        chatScroll: PropTypes.func,
        count: PropTypes.count,
        users: PropTypes.array,
	}
	constructor(props) {
		super(props);
		this.state = {
		};
    }
    componentDidMount() {
        this.chatview.scrollTop = this.chatview.scrollHeight;
        console.log('componentDidMount-message', this.chatview.scrollTop, this.chatview.scrollHeight);
    }
    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps, this.state);
        // if (nextProps.messages.length > this.state.messages) {
        //     this.setState({ messages: nextProps.messages, num: Math.random() });
        // }
    }
    componentDidUpdate() {
        this.chatview.scrollIntoView(400);
        if (this.props.count === 1) {
            this.chatview.scrollTop = this.chatview.scrollHeight;
        }
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
        console.log('result', this.props);
        const groupId = this.props.chatGroup ? this.props.chatGroup._id : '';
        return (
            <div
                className="chat-message-list"
                ref={i => this.chatview = i}
                onScroll={this.props.chatScroll}
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
                                        message.to === groupId ?
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
            </div>
        );
    }
}

export default Message;
