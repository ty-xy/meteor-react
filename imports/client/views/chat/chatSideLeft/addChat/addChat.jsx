import React, { Component } from 'react';

class AddChat extends Component {
    render() {
        return (
            <div>
                <div className="chat-add-tab" >
                    <div className="arrow arrow-border" />
                    <div className="arrow arrow-bg" />
                    <p className="add-friend">添加好友</p>
                    <p className="add-group">发起群聊</p>
                </div>
                <div className="chat-add-user">
                    +
                </div>
            </div>
        );
    }
}

export default AddChat;
