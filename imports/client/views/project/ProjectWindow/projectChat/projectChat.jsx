import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Popover } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import format from 'date-format';

import formatDate from '../../../../../util/formatDate';
import feedback from '../../../../../util/feedback';
import Icon from '../../../../components/Icon';
import Avatar from '../../../../components/Avatar';
import Message from '../../../../../../imports/schema/message';
import Group from '../../../../../../imports/schema/group';
import expressions from '../../../../../util/expressions';
import PopulateUtil from '../../../../../util/populate';

const transparentImage = 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==';
@pureRender
class projectChat extends Component {
    static propTypes = {
        messages: PropTypes.arrayOf(PropTypes.object),
        pId: PropTypes.string,

    }
    componentDidUpdate() {
        if (this.props.pId) {
            this.$message.addEventListener('keydown', this.handleSendMessage);
        }
    }
    handleChatUser = (fromId, toId, groupId) => {
        if (fromId === Meteor.userId()) {
            return;
        }
        if (toId === groupId) {
            // 是一个群里的成员,允许创建临时会话
            // console.log('是一个群里的成员,允许创建临时会话');
            this.setState({
                temporaryChat: true,
            });
            this.handleFriendId(fromId);
        }
    }
    handleSendMessage = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.sendText();
        }
    }
    sendMessage = (content, type) => {
        Meteor.call(
            'insertMessage',
            {
                content,
                to: this.props.pId,
                type,
            },
            (err) => {
                feedback.dealError(err);
                this.$message.value = '';
            });
    }
    sendText = () => {
        this.sendMessage(this.$message.value, 'text');
    }
    convertExpression = txt => ({
        __html: txt.replace(
            /#\(([\u4e00-\u9fa5a-z0-9-]+)\)/g,
            (r, e) => {
                const index = expressions.default.indexOf(e);
                if (index !== -1) {
                    return `<img class="expression-default-message" src="${transparentImage}" style="background-position: left ${-30 * index}px; background-image: url('/expressions.png'); width: 30px ;height: 30px;" onerror="this.style.display='none'" alt="${r}">`;
                }
                return r;
            },
        ).replace(
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
            r => (
                `<a href="${r}" rel="noopener noreferrer" target="_blank">${r}</a>`
            ),
        ),
    })
    handleClick = (e) => {
        const name = e.currentTarget.dataset.name;
        this.$message.value += `#(${name})`;
    }
    renderText = content => (
        <div className="user-message" dangerouslySetInnerHTML={this.convertExpression(content)} />
    )

    renderContent = (type, content) => {
        switch (type) {
        case 'text':
            return this.renderText(content);
        case 'file':
            return this.renderFile(content);
        default:
            return <span>未知消息</span>;
        }
    }

    renderDefaultExpression = () => (
        <div className="default-expression" style={{ width: '400px', height: '200px' }}>
            {
                expressions.default.map((e, index) => (
                    <div
                        key={index}
                        data-name={e}
                        onClick={this.handleClick}
                        style={{ width: '40px', height: '40px', padding: '5px' }}
                    >
                        <div className="no-click" style={{ backgroundPosition: `left ${-30 * index}px`, backgroundImage: 'url(\'/expressions.png\')', width: '30px', height: '30px' }} />
                    </div>
                ))
            }
        </div>
    )

    render() {
        // const groupId = this.props.chatGroup ? this.props.chatGroup._id : '';
        const groupId = this.props.pId;
        console.log(this.props.pId);
        return (
            <div className="project-chat-window">
                <div className="project-chat-border" ref={i => this.messageList = i}>
                    {
                        this.props.messages.map((message, index) => (
                            <div
                                key={index}
                            >
                                {
                                    message.showYearMonth ?
                                        <div className="message-time">{formatDate.dealMessageTime(message.createdAt)}</div>
                                        :
                                        null
                                }
                                <div className={message.from._id === Meteor.userId() ? 'self-message' : 'message'}>
                                    <p className="user-avatar" onClick={() => this.handleChatUser(message.from._id, message.to, groupId)}>
                                        <Avatar name={message.from.profile.name} avatarColor={message.from.profile.avatarColor} avatar={message.from.profile.avatar} />
                                    </p>
                                    <div className="user-message-wrap">
                                        {
                                            message.to === groupId ?
                                                <p className="user-nickname">{message.from.profile.name}</p>
                                                :
                                                null
                                        }
                                        {
                                            this.renderContent(message.type, message.content)
                                        }
                                    </div>
                                    {/* <div>{message.from._id !== Meteor.userId() ? '' : (message.readedMembers.includes(message.to) ? '(已读)' : '(未读)')}</div> */}
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="project-chat-nav">
                    <Popover placement="topLeft" content={this.renderDefaultExpression()} trigger="click">
                        <Icon icon="icon-biaoqing icon" size={20} />
                    </Popover>
                    {/* <Icon icon="icon-wenjian icon" size={20} /> */}
                </div>
                <div className="project-chat-input">
                    <textarea name="" id="" cols="30" rows="10" ref={i => this.$message = i} />
                    <p className="chat-send-message" onClick={this.sendText}>发送</p>
                </div>

            </div>
        );
    }
}
export default withTracker(({ to, userId, pId }) => {
    Meteor.subscribe('message');
    Meteor.subscribe('group');
    Meteor.subscribe('files');
    const chatGroup = Group.findOne({ _id: to });
    // PopulateUtil.group(chatGroup);
    const files = Message.find({ to, type: 'file' }, { sort: { createdAt: -1 } }).fetch().map(msg => PopulateUtil.file(msg.content));
    if (files[0]) {
        files.forEach((d, i, data) => {
            d.showYearMonth = false;
            d.fileFrom = PopulateUtil.user(d.from).profile.name;
            if (i) {
                const prev = data[i - 1];
                d.showYearMonth = format('yyyy-MM', d.createdAt) !== format('yyyy-MM', prev.createdAt);
            } else {
                d.showYearMonth = true;
            }
        });
    }
    console.log(pId);
    const messages = Message.find({ to: pId }).fetch();
    messages.forEach((d, i, data) => {
        d.showYearMonth = false;
        if (i) {
            const prev = data[i - 1];
            d.showYearMonth = d.createdAt.getTime() - prev.createdAt.getTime() > 10 * 60 * 1000;
        } else {
            d.showYearMonth = true;
        }
    });
    return {
        messages,
        to,
        chatUser: Meteor.users.findOne({ _id: userId }),
        chatGroup,
        files,
    };
})(projectChat);

