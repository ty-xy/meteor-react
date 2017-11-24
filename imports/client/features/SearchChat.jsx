import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Input, Card } from 'antd';
import PropTypes from 'prop-types';

import Avatar from '../components/Avatar';
import IdUtil from '../../util/id';

const Search = Input.Search;

class SearchChat extends Component {
    static propTypes = {
        changeTo: PropTypes.func.isRequired,
    }
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
            console.log(result);
            this.setState({
                friends: result.friends,
                groups: result.groups,
            });
            await this.setState({
                showSearchResult: true,
            });
            document.addEventListener('click', this.closeMenu);
        });
    }

    closeMenu = (e) => {
        this.setState({
            showSearchResult: false,
        });
        e.stopProPagation();
        document.removeEventListener('click', this.closeMenu);
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
                                this.state.friends && this.state.groups && this.state.friends.length === 0 && this.state.groups.length === 0 ?
                                    <div className="search-chat-no-result">
                                        <div className="no-result">
                                            <img src="/noSearchResult.png" alt="" />
                                            <p>搜索无结果</p>
                                        </div>
                                    </div>
                                    :


                                    <div className="search-chat-result">
                                        <Card title="好友" extra={this.state.friends && this.state.friends.length ? <span>{this.state.friends.length}</span> : null}>
                                            {
                                                this.state.friends && this.state.friends.length > 0 ?
                                                    this.state.friends.map(friend =>
                                                        (<div
                                                            className="user-item-card"
                                                            key={friend._id}
                                                            onClick={() => {
                                                                this.props.changeTo(IdUtil.merge(Meteor.userId(), friend._id), friend._id, '', 'message');
                                                            }}
                                                        >
                                                            <Avatar name={friend.profile.name} avatarColor={friend.profile.avatarColor} avatar={friend.profile.avatar} />
                                                            <div className="user-name">{this.getHighlightedText(friend.profile.name, this.state.searchValue)}</div>
                                                        </div>),
                                                    )
                                                    :
                                                    <div>暂无好友搜索结果</div>
                                            }

                                        </Card>
                                        <Card title="群组" extra={this.state.groups && this.state.groups.length ? <span>{this.state.groups.length}</span> : null}>
                                            {
                                                this.state.groups && this.state.groups.length > 0 ?
                                                    this.state.groups.map(group =>
                                                        (<div
                                                            className="user-item-card"
                                                            key={group._id}
                                                            onClick={() => {
                                                                this.props.changeTo(group._id, group._id, '', 'message');
                                                            }}
                                                        >
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
