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
    sendMessage = () => {
        Meteor.call(
            'insertMessage',
            {
                content: this.$message.value,
                createdAt: new Date(),
                to: this.props.to,
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
            this.sendMessage();
        }
    }
    handleClick = (e) => {
        const name = e.currentTarget.dataset.name;
        this.$message.value = `#(${name})`;
        // must use setTimeout, otherwise the exit animation does not display properly
    }
    convertExpression = txt => ({
        __html: txt.replace(
            /#\(([\u4e00-\u9fa5a-z]+)\)/g,
            (r, e) => {
                const index = expressions.default.indexOf(e);
                if (index !== -1) {
                    return `<img class="expression-default-message" src="${transparentImage}" style="background-position: left ${-30 * index}px; background-image: url('/expressions.png'); width: 30px ;height: 30px;" onerror="this.style.display='none'" alt="${r}">`;
                }
                return r;
            },
        ),
    })
    sendFilesendFile = () => {
        this.fileInput.click();
    }
    selectFile = () => {
        const file = this.fileInput.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onloadend = function () {
            Meteor.call('sendFile', this.result, this.props.to, (err) => {
                if (err) {
                    return console.error(err.reason);
                }
                console.log('发送文件成功');
            });
        };
        reader.readAsArrayBuffer(file);
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
        const { profile = {}, username = '', _id = '' } = this.props.chatUser || {};
        const { name = '', avatarColor = '', avatar = '' } = profile;
        const groupName = this.props.chatGroup ? this.props.chatGroup.name : '';
        const groupId = this.props.chatGroup ? this.props.chatGroup._id : '';
        const members = this.props.chatGroup ? this.props.chatGroup.members : [];
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
                        this.props.messages.map((message, i) => {
                            console.log(message.content, message.from._id === Meteor.userId() ? '我应该在右边' : '我应该在左边');
                            return (
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
                                        <p className="user-message" dangerouslySetInnerHTML={this.convertExpression(message.content)} />
                                    </div>
                                </div>
                            );
                        })
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
    const chatGroup = Group.findOne({ _id: to });
    PopulateUtil.group(chatGroup);

    return {
        messages: Message.find({ to }).fetch(),
        to,
        chatUser: Meteor.users.findOne({ _id: userId }),
        chatGroup,
    };
})(ChatWindow);

