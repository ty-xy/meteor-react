import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';

import AddFriend from './addFriend';
import AddGroup from './addGroup';

@pureRender
class AddChat extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            isShowAddTooltip: false,
            isShowAddFriend: false,
            isShowAddGroup: false,
            isShowFriendCode: false,
        };
    }
    handleClick = () => {
        this.setState({
            isShowAddTooltip: !this.state.isShowAddTooltip,
        });
    }
    handleAddFriend = () => {
        this.setState({
            isShowAddFriend: !this.state.isShowAddFriend,
        });
    }
    handleFriendCode = () => {
        this.setState({
            isShowFriendCode: !this.state.isShowFriendCode,
        });
    }
    handleAddGroup = () => {
        this.setState({
            isShowAddGroup: !this.state.isShowAddGroup,
        });
    }
    render() {
        return (
            <div className="ejianlian-add-chat">
                <div className="chat-add-tab" style={{ display: this.state.isShowAddTooltip ? 'block' : 'none' }}>
                    <div className="arrow arrow-border" />
                    <div className="arrow arrow-bg" />
                    <p className="add-friend" onClick={this.handleAddFriend}>添加好友</p>
                    <p className="add-group" onClick={this.handleAddGroup}>发起群聊</p>
                </div>
                <div className="chat-add-user" onClick={this.handleClick}>
                    +
                </div>
                <AddFriend
                    handleAddFriend={this.handleAddFriend}
                    handleFriendCode={this.handleFriendCode}
                    isShowAddFriend={this.state.isShowAddFriend}
                    isShowFriendCode={this.state.isShowFriendCode}
                />
                <AddGroup
                    handleAddGroup={this.handleAddGroup}
                    isShowAddGroup={this.state.isShowAddGroup}
                />
            </div>
        );
    }
}

export default AddChat;
