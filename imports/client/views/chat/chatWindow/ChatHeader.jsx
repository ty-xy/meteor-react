import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import pureRender from 'pure-render-decorator';
import { Modal } from 'antd';

import ChatFriendFile from './ChatFriendFile';
import GroupNotice from './GroupNotice';
import GroupSetting from './GroupSetting';
import Icon from '../../../components/Icon';
// import UserUtil from '../../../../util/user';

@pureRender
class ChatHeader extends Component {
    constructor(...arg) {
        super(...arg);
        this.state = {};
    }

	handleGroupNotice = () => {
	    this.setState({
	        isShowNotice: !this.state.isShowNotice,
	    });
	    this.readNotice();
	}

    handleFriendFile = () => {
        this.setState({
            isShowFriendFile: !this.state.isShowFriendFile,
        });
    }
	// 显示为已读公告
	readNotice = () => {
	    this.setState({
	        isNewNotice: false,
	    });
	}
    showGroupSet = () => {
        this.setState({
            isShowGroupSet: !this.state.isShowGroupSet,
        });
    }

    render() {
        const { chatGroup } = this.props;
        const { location } = this.props;
        const Id = chatGroup.type === 'user' ? chatGroup.members.filter(value => value !== Meteor.userId()) : '';
        const chUSer = Meteor.users.findOne({ _id: Id[0] }) || {};
        const { name } = chUSer.profile || {};
        const groupId = this.props.chatGroup ? this.props.chatGroup._id : '';
        const memberIds = this.props.chatGroup ? this.props.chatGroup.members : [];
        const admin = this.props.chatGroup ? this.props.chatGroup.admin : '';
        const notice = this.props.chatGroup ? this.props.chatGroup.notice : '';

        const { type, avatar, isDisturb = [], noticeTime = new Date() } = chatGroup;
        const stickTop = chatGroup.stickTop ? chatGroup.stickTop.find(x => x.userId && x.userId === Meteor.userId()) : {};
        console.log(this.props, this.props.chatGroup.type, location);
        return (
            <div className="chat-window-header">
                {
                    location.state && location.state.type === 'user' ?
                        <div className="chat-to-user">
                            {name}
                            <div className="chat-other-account">
                                <Icon icon="icon-wenjian icon" onClick={this.handleFriendFile} />
                                <Icon
                                    icon="icon-gerenziliao icon"
                                    onClick={() => this.props.handleFriendId(chUSer._id)}
                                />
                            </div>
                        </div>
                        :
                        <div className="chat-to-user">
                            {chatGroup && chatGroup.name}
                            <div className="chat-other-account">
                                {
                                    this.state.isNewNotice ?
                                        <span className="notive-red-not" />
                                        :
                                        null
                                }

                                <Icon icon="icon-tongzhi2 icon" onClick={this.handleGroupNotice} />
                                <Icon icon="icon-wenjian icon" onClick={this.handleFriendFile} />
                                <Icon icon="icon-shezhi icon" onClick={this.showGroupSet} />
                            </div>
                        </div>
                }
                {
                    this.state.isShowFriendFile ?
                        <ChatFriendFile
                            handleFriendFile={this.handleFriendFile}
                            files={this.props.files}
                        />
                        :
                        null
                }
                <Modal
                    title="群设置"
                    visible={this.state.isShowGroupSet}
                    onCancel={this.showGroupSet}
                    width={370}
                    wrapClassName="create-team-mask"
                    footer={null}
                >
                    <GroupSetting
                        showGroupSet={this.showGroupSet}
                        groupName={chatGroup && chatGroup.name}
                        groupMemberIds={memberIds}
                        groupId={groupId}
                        admin={admin}
                        isDisturb={isDisturb}
                        stickTop={stickTop}
                        avatar={avatar}
                        changeTo={this.changeTo}
                        handleFriendIdInfo={this.props.handleFriendIdInfo}
                        groupType={type}
                        handleToggle={this.handleToggle}
                        {...this.props}
                    />
                </Modal>
                {
                    this.state.isShowNotice ?
                        <GroupNotice
                            handleGroupNotice={this.handleGroupNotice}
                            admin={admin}
                            notice={notice}
                            groupId={groupId}
                            noticeTime={noticeTime}
                            showNewNotice={this.showNewNotice}
                        />
                        :
                        null
                }
            </div>
        );
    }
}
ChatHeader.propTypes = {
    chatGroup: PropTypes.object,
    chatUser: PropTypes.object,
    location: PropTypes.object,
    handleFriendIdInfo: PropTypes.func,
    handleFriendId: PropTypes.func,
    files: PropTypes.array,
};

export default ChatHeader;
