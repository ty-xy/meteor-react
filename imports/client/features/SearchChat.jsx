import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Input, Card } from 'antd';

import Avatar from '../components/Avatar';
import eventUtil from '../../util/eventUtil';

const Search = Input.Search;

class SearchChat extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            friends: [],
            groups: [],
            showSearchResult: false,
            searchValue: '',
        };
    }
    getHighlightedText = (text, higlight) => {
        // Split on higlight term and include term into parts, ignore case
        const parts = text.split(new RegExp(`(${higlight})`, 'gi'));
        return (<span> {parts.map((part, i) =>
            (<span key={i} style={part.toLowerCase() === higlight.toLowerCase() ? { color: '#29b6f6' } : {}}>
                {part}
            </span>))
        } </span>);
    }
    search = (value) => {
        this.setState({
            searchValue: value,
        });
        Meteor.call('searchChat', value, async (err, result) => {
            this.setState({
                friends: result.friends,
                groups: result.groups,
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
        return (
            <div className="serach-chat">
                <div className="certain-category-search-wrapper">
                    <Search onSearch={this.search} placeholder="好友,群组" />
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
                                                            <div className="user-name">{this.getHighlightedText(friend.profile.name, this.state.searchValue)}</div>
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
                                                            <div className="user-name">{this.getHighlightedText(group.name, this.state.searchValue)}</div>
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
