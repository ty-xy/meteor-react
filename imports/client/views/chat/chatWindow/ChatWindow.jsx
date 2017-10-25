import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Popover, Tooltip } from 'antd';

import Message from '../../../../../imports/schema/message';
import Group from '../../../../../imports/schema/group';
import PopulateUtil from '../../../../util/populate';

import ChatFriendInfo from './ChatFriendInfo';
import ChatFriendFile from './ChatFriendFile';
import GroupSetting from './GroupSetting';
import Avatar from '../../../components/Avatar';
import Icon from '../../../components/Icon';
import expressions from '../../../../util/expressions';
import feedback from '../../../../util/feedback';

// import messageTool from '../../../../util/message';
const transparentImage = 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==';

@pureRender
class ChatWindow extends Component {
    static propTypes = {
        messages: PropTypes.arrayOf(PropTypes.object),
        to: PropTypes.string,
        chatUser: PropTypes.object,
        chatGroup: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isShowFriendInfo: false,
            isShowFriendFile: false,
            isShowGroupSet: false,
        };
    }
    componentDidMount() {
        this.$message.addEventListener('keydown', this.handleSendMessage);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.messages && this.props.messages && prevProps.messages.length !== this.props.messages.length) {
            const $lastMessage = this.messageList.children[this.messageList.children.length - 1];
            if ($lastMessage) {
                $lastMessage.scrollIntoView(true);
            }
        }
    }
    handleFriendInfo = () => {
        this.setState({
            isShowFriendInfo: !this.state.isShowFriendInfo,
        });
    }
    handleFriendFile = () => {
        this.setState({
            isShowFriendFile: !this.state.isShowFriendFile,
        });
    }
    showGroupSet = () => {
        this.setState({
            isShowGroupSet: !this.state.isShowGroupSet,
        });
    }
    sendMessage = (content, type) => {
        Meteor.call(
            'insertMessage',
            {
                content,
                to: this.props.to,
                type,
            },
            (err) => {
                if (err) {
                    return console.error(err.reason);
                }
                this.$message.value = '';
            });
    }
    handleSendMessage = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.sendMessage(this.$message.value, 'text');
        }
    }
    handleClick = (e) => {
        const name = e.currentTarget.dataset.name;
        this.$message.value = `#(${name})`;
        // must use setTimeout, otherwise the exit animation does not display properly
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
        ),
    })
    sendFile = () => {
        this.fileInput.click();
    }
    selectFile = () => {
        const file = this.fileInput.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        const name = file.name;
        const type = name.slice(name.lastIndexOf('.') + 1);
        const size = file.size;
        const sendMessage = this.sendMessage;
        reader.onloadend = function () {
            Meteor.call('insertFile', name, type, size, (err, res) => {
                feedback.dealError(err);
                sendMessage(res, 'file');
            });
        };
        reader.readAsDataURL(file);
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
    renderFile = (content) => {
        const result = PopulateUtil.file(content);
        let size = result.size;
        let unit = 'B';
        if (size > 1024) {
            size /= 1024;
            unit = 'KB';
        }
        if (size > 1024) {
            size /= 1024;
            unit = 'MB';
        }
        return (
            <div className="file">
                <div className="file-icon">
                    <Icon icon="icon-wenjian" size={30} iconColor="#ffca28" />
                </div>
                <div>
                    <p>{result.name}</p>
                    <p className="file-size">{size.toFixed(2) + unit}</p>
                </div>
                <a href={result.url} download>
                下载
                </a>
            </div>
        );
    }
    renderUrl = content => (
        <a href={content} rel="noopener noreferrer" target="_blank">{content}</a>
    )
    renderImage = () => (
        <div className="user-img">
            <img
                src="http://pic.58pic.com/58pic/13/23/37/01958PICjAH_1024.jpg"
                ref={i => this.img = i}
                onLoad={this.imageLoad}

                onError={() => this.img.src = require('../assets/images/image_not_found.png')}
            />
        </div>
    )
    renderText = content => (
        <div className="user-message" dangerouslySetInnerHTML={this.convertExpression(content)} />
    )
    renderContent = (type, content) => {
        switch (type) {
        case 'text':
            return this.renderText(content);
        case 'url':
            return this.renderUrl(content);
        case 'image':
            return this.renderImage(content);
        case 'file':
            return this.renderFile(content);
        default:
            return <span>未知消息</span>;
        }
    }
    render() {
        const { profile = {}, username = '', _id = '' } = this.props.chatUser || {};
        const { name = '', avatarColor = '', avatar = '' } = profile;
        const groupName = this.props.chatGroup ? this.props.chatGroup.name : '';
        const groupId = this.props.chatGroup ? this.props.chatGroup._id : '';
        const members = this.props.chatGroup ? this.props.chatGroup.members : [];
        const admin = this.props.chatGroup ? this.props.chatGroup.admin._id : '';
        return (
            <div className="ejianlian-chat-window">
                {
                    name ?
                        <div className="chat-to-user">
                            {name}
                            <div className="chat-other-account">
                                <p>
                                    <Icon icon="icon-wenjian icon" onClick={this.handleFriendFile} />
                                </p>
                                <p>
                                    <Icon icon="icon-gerenziliao icon" onClick={this.handleFriendInfo} />
                                </p>
                            </div>
                        </div>
                        :
                        <div className="chat-to-user">
                            {groupName}
                            <div className="chat-other-account">
                                <p>
                                    <Icon icon="icon-tongzhi2 icon" />
                                </p>
                                <p>
                                    <Icon icon="icon-wenjian icon" />
                                </p>
                                <p>
                                    <Icon icon="icon-shezhi icon" onClick={this.showGroupSet} />
                                </p>
                            </div>
                        </div>
                }
                <div className="chat-message-list" ref={i => this.messageList = i}>
                    {
                        this.props.messages.map((message, i) => (
                            <div className={message.from._id === Meteor.userId() ? 'self-message' : 'message'} key={i}>
                                <p className="user-avatar">
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
                            </div>
                        ))
                    }
                </div>
                <div className="chat-window-bottom">
                    <div className="chat-send-skill">
                        <p className="skill-icon">
                            <Popover placement="topLeft" content={this.renderDefaultExpression()} trigger="click">
                                <Icon icon="icon-biaoqing icon" />
                            </Popover>
                        </p>
                        <p className="skill-icon">
                            <Tooltip title="发送文件" mouseEnterDelay={1}>
                                <Icon icon="icon-wenjian icon" onClick={this.sendFile} />
                                <input
                                    className="input-file"
                                    type="file"
                                    ref={i => this.fileInput = i}
                                    onChange={this.selectFile}
                                />
                            </Tooltip>
                        </p>
                        <p className="skill-icon">
                            <Icon icon="icon-card icon" />
                        </p>
                        <p className="skill-icon">
                            <Icon icon="icon-dakaishipin icon" size={20} />
                        </p>
                    </div>
                    <div className="chat-message-input">
                        <textarea name="" id="" cols="30" rows="10" ref={i => this.$message = i} />
                        <p className="chat-send-message" onClick={this.sendMessage}>发送</p>
                    </div>
                </div>
                <ChatFriendInfo
                    style={{ display: this.state.isShowFriendInfo ? 'block' : 'none' }}
                    handleFriendInfo={this.handleFriendInfo}
                    name={name}
                    avatarColor={avatarColor}
                    username={username}
                    avatar={avatar}
                    friendId={_id}
                />
                <ChatFriendFile
                    style={{ display: this.state.isShowFriendFile ? 'block' : 'none' }}
                    handleFriendFile={this.handleFriendFile}
                />
                {
                    this.state.isShowGroupSet ?
                        <GroupSetting
                            showGroupSet={this.showGroupSet}
                            groupName={groupName}
                            members={members}
                            groupId={groupId}
                            admin={admin}
                        />
                        :
                        null
                }
            </div>
        );
    }
}

export default withTracker(({ to, userId }) => {
    Meteor.subscribe('message');
    Meteor.subscribe('group');
    Meteor.subscribe('file');
    const chatGroup = Group.findOne({ _id: to });
    PopulateUtil.group(chatGroup);
    return {
        messages: Message.find({ to }).fetch(),
        to,
        chatUser: Meteor.users.findOne({ _id: userId }),
        chatGroup,
    };
})(ChatWindow);

