import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Input, Card } from 'antd';

import Avatar from '../components/Avatar';
import Group from '../../schema/group';
import fields from '../../util/fields';
import eventUtil from '../../util/eventUtil';

const Search = Input.Search;

class SearchChat extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            friends: [],
            groups: [],
            messages: [],
            showSearchResult: false,
        };
    }
    search = (value) => {
        // console.log(value);
        Meteor.call('searchChat', value, async (err, result) => {
            // console.log(7777, result);
            this.setState({
                friends: result.friends,
                groups: result.groups,
                messages: result.message,
            });
            Meteor.subscribe('users');
            Meteor.subscribe('group');
            await this.state.messages.forEach((k) => {
                if (k.to.length <= 17) {
                    k.chat = Group.findOne({ _id: k.to }, { fields: fields.searchGroup });
                    return;
                    // 群聊天
                } else if (k.to.length >= 34) {
                    const userId = k.to.slice(0, k.to.length / 2);
                    if (userId !== Meteor.userId()) {
                        // 用户聊天
                        k.chat = Meteor.users.findOne({ _id: userId }, { fields: fields.searchUser });
                        return;
                    }
                    k.chat = Meteor.users.findOne({ _id: k.from }, { fields: fields.searchUser });
                    return;
                }
                console.log('to字段Id的长度', k.to.length);
            });
            await this.setState({
                showSearchResult: true,
            });
            eventUtil.addEvent(document, 'click', this.closeMenu);
        });
    }
    closeMenu = (e) => {
        this.setState({
            showSearchResult: false,
        });
        eventUtil.stopProPagation(e);
        eventUtil.removeEvent(document, 'click', this.closeMenu);
    }
    render() {
        // console.log(1111, this.state.friends, this.state.groups, this.state.messages);
        return (
            <div className="serach-chat">
                <div className="certain-category-search-wrapper">
                    <Search onSearch={this.search} placeholder="好友,群组,聊天记录" />
                </div>
                {
                    this.state.showSearchResult ?
                        <div>
                            {
                                this.state.friends.length === 0 && this.state.groups.length === 0 && this.state.messages.length === 0 ?
                                    <div className="search-chat-no-result">
                                        <div className="no-result">
                                            <img src="/noSearchResult.png" alt="" />
                                            <p>搜索无结果</p>
                                        </div>
                                    </div>
                                    :


                                    <div className="search-chat-result">
                                        <Card title="好友" extra={<span>{this.state.friends.length}</span>}>
                                            {
                                                this.state.friends.length > 0 ?
                                                    this.state.friends.map(friend =>
                                                        (<div className="user-item-card" key={friend._id}>
                                                            <Avatar name={friend.profile.name} avatarColor={friend.profile.avatarColor} avatar={friend.profile.avatar} />
                                                            <div className="user-name">{friend.profile.name}</div>
                                                        </div>),
                                                    )
                                                    :
                                                    <div>暂无好友搜索结果</div>
                                            }

                                        </Card>
                                        <Card title="群组" extra={<span>{this.state.groups.length}</span>}>
                                            {
                                                this.state.groups.length > 0 ?
                                                    this.state.groups.map(group =>
                                                        (<div className="user-item-card" key={group._id}>
                                                            <Avatar name={group.name} avatar={group.avatar} />
                                                            <div className="user-name">{group.name}</div>
                                                        </div>),
                                                    )
                                                    :
                                                    <div>暂无群组搜索结果</div>
                                            }
                                        </Card>
                                        <Card title="聊天记录" extra={<span>2</span>} >
                                            {
                                                this.state.messages.length > 0 ?
                                                    this.state.messages.map(message =>
                                                        (<div className="user-item-card" key={message._id}>
                                                            {
                                                                message.chat && message.chat.name ?
                                                                    <Avatar name={message.chat.name} avatar={message.chat.avatar} />
                                                                    :
                                                                    message.chat && message.chat.profile ?
                                                                        <Avatar avatarColor={message.chat.profile.avatarColor} name={message.chat.profile.name} avatar={message.chat.profile.avatar} />
                                                                        :
                                                                        null

                                                            }

                                                            <div>
                                                                {
                                                                    message.chat && message.chat.name ?
                                                                        <div>{message.chat.name}</div>
                                                                        :
                                                                        message.chat && message.chat.profile ?
                                                                            <div>{message.chat.profile.name}</div>
                                                                            :
                                                                            <div>用户名</div>

                                                                }
                                                                <div className="chat-record">{message.content}</div>
                                                            </div>


                                                        </div>),
                                                    )
                                                    :
                                                    <div>暂无群组搜索结果</div>
                                            }
                                        </Card>
                                    </div>
                            }
                        </div>
                        :
                        null
                }

            </div>
        );
    }
}

export default SearchChat;
