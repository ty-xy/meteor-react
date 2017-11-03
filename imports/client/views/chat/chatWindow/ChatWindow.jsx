import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Popover, Tooltip } from 'antd';
import format from 'date-format';

import Message from '../../../../../imports/schema/message';
import Group from '../../../../../imports/schema/group';
import PopulateUtil from '../../../../util/populate';
import feedback from '../../../../util/feedback';
import formatDate from '../../../../util/formatDate';

import ChatFriendInfo from './ChatFriendInfo';
import ChatFriendFile from './ChatFriendFile';
import GroupNotice from './GroupNotice';
import GroupSetting from './GroupSetting';
import Avatar from '../../../components/Avatar';
import Icon from '../../../components/Icon';
import expressions from '../../../../util/expressions';
import ImageViewer from '../../../features/ImageViewer';
import VideoMeeting from '../../../features/VideoMeeting';
import EmptyChat from '../../../components/EmptyChat';

// import messageTool from '../../../../util/message';
const transparentImage = 'data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==';

@pureRender
class ChatWindow extends Component {
    static propTypes = {
        messages: PropTypes.arrayOf(PropTypes.object),
        to: PropTypes.string,
        chatUser: PropTypes.object,
        chatGroup: PropTypes.object,
        files: PropTypes.array,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isShowFriendInfo: false,
            isShowFriendFile: false,
            isShowGroupSet: false,
            showImgViewer: false,
            image: '',
            videoTracks: null,
            isShowVideo: false,
            isShowNotice: false,
        };
    }

    componentDidUpdate(prevProps) {
        this.props.messages.forEach((i) => {
            if (!i.readedMembers.includes(Meteor.userId())) {
                Meteor.call('readMessage', i._id, Meteor.userId(), (err) => {
                    console.log(err);
                });
            }
        });
        if (prevProps.messages && this.props.messages && prevProps.messages.length !== this.props.messages.length && this.messageList && this.messageList.length > 0) {
            const $lastMessage = this.messageList.children[this.messageList.children.length - 1];
            if ($lastMessage) {
                $lastMessage.scrollIntoView(true);
            }
        }
        if (this.props.to) {
            this.$message.addEventListener('keydown', this.handleSendMessage);
        }
    }
    handleGroupNotice = () => {
        this.setState({
            isShowNotice: !this.state.isShowNotice,
        });
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
                feedback.dealError(err);
                this.$message.value = '';
            });
    }
    handleSendMessage = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.sendText();
        }
    }
    // 发送文字和表情
    sendText = () => {
        this.sendMessage(this.$message.value, 'text');
    }
    handleClick = (e) => {
        const name = e.currentTarget.dataset.name;
        this.$message.value = `#(${name})`;
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
    // 发送文件
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
        const fileType = file.type;
        const type = fileType.slice(fileType.lastIndexOf('/') + 1) || '';
        const size = file.size;
        const sendMessage = this.sendMessage;

        reader.onloadend = function () {
            Meteor.call('insertFile', name, type, size, this.result, (err, res) => {
                feedback.dealError(err);
                if (res) {
                    sendMessage(res, 'file');
                }
            });
        };
        reader.readAsDataURL(file);
    }
    // 发起视频
    sendVideo = () => {
        this.setState({
            isShowVideo: !this.state.isShowVideo,
        });
    }
    handleImageDoubleClick = (url) => {
        this.setState({
            showImgViewer: true,
            image: url,
        });
    }
    closeImageViewer = () => {
        this.setState({
            showImgViewer: false,
        });
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
        if (/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(result.type)) {
            return this.renderImage(result.url);
        }

        return (
            <div className="file">
                <div className="file-icon">
                    <Icon icon="icon-wenjian" size={30} iconColor="#ffca28" />
                </div>
                <div>
                    <p>{result.name}</p>
                    <p className="file-size">{result.size}</p>
                </div>
                <a href={result.url} download>
                    下载
                </a>
            </div>
        );
    }
    renderImage = url => (
        <div className="user-img">
            <img
                src={url}
                ref={i => this.img = i}
                onLoad={this.imageLoad}
                onDoubleClick={() => this.handleImageDoubleClick(url)}
                onError={() => this.img.src = 'http://oxldjnom8.bkt.clouddn.com/404Img.jpeg'}
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
        const notice = this.props.chatGroup ? this.props.chatGroup.notice : '';
        const noticeTime = this.props.chatGroup ? this.props.chatGroup.noticeTime : new Date();
        const isDisturb = this.props.chatGroup ? this.props.chatGroup.isDisturb : false;
        const stickTop = this.props.chatGroup ? this.props.chatGroup.stickTop : {};
        const groupAvatar = this.props.chatGroup ? this.props.chatGroup.avatar : '';
        return this.props.to ?
            <div className="ejianlian-chat-window">

                {
                    this.state.isShowVideo ?
                        <VideoMeeting
                            closeVideo={this.sendVideo}
                        />
                        :
                        null
                }
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
                                    <Icon icon="icon-tongzhi2 icon" onClick={this.handleGroupNotice} />
                                </p>
                                <p>
                                    <Icon icon="icon-wenjian icon" onClick={this.handleFriendFile} />
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
                            <div key={i}>
                                {
                                    message.showYearMonth ?
                                        <div className="message-time">{formatDate.dealMessageTime(message.createdAt)}</div>
                                        :
                                        null
                                }
                                <div className={message.from._id === Meteor.userId() ? 'self-message' : 'message'}>
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
                                    {/* <div>{message.from._id !== Meteor.userId() ? '' : (message.readedMembers.includes(message.to) ? '(已读)' : '(未读)')}</div> */}
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
                        {/* <p className="skill-icon">
                            <Icon icon="icon-card icon" />
                        </p> */}
                        {/* <p className="skill-icon">
                            <Icon icon="icon-dakaishipin icon" size={20} onClick={this.sendVideo} />
                        </p> */}
                    </div>
                    <div className="chat-message-input">
                        <textarea name="" id="" cols="30" rows="10" ref={i => this.$message = i} />
                        <p className="chat-send-message" onClick={this.sendText}>发送</p>
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
                {
                    this.state.isShowFriendFile ?
                        <ChatFriendFile
                            handleFriendFile={this.handleFriendFile}
                            files={this.props.files}
                        />
                        :
                        null
                }
                {
                    this.state.isShowGroupSet ?
                        <GroupSetting
                            showGroupSet={this.showGroupSet}
                            groupName={groupName}
                            members={members}
                            groupId={groupId}
                            admin={admin}
                            isDisturb={isDisturb}
                            stickTop={stickTop}
                            avatar={groupAvatar}
                        />
                        :
                        null
                }
                {
                    this.state.showImgViewer ?
                        <ImageViewer
                            image={this.state.image}
                            closeImage={this.closeImageViewer}
                        />
                        :
                        null
                }
                {
                    this.state.isShowNotice ?
                        <GroupNotice
                            handleGroupNotice={this.handleGroupNotice}
                            admin={admin}
                            notice={notice}
                            groupId={groupId}
                            noticeTime={noticeTime}
                        />
                        :
                        null
                }
            </div>

            :
            <EmptyChat />;
    }
}

export default withTracker(({ to, userId }) => {
    Meteor.subscribe('message');
    Meteor.subscribe('group');
    Meteor.subscribe('file');
    const chatGroup = Group.findOne({ _id: to });
    PopulateUtil.group(chatGroup);
    const files = Message.find({ to, type: 'file' }).fetch().map(msg => PopulateUtil.file(msg.content));
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
    const messages = Message.find({ to }).fetch();
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
})(ChatWindow);

