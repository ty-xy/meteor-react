import React, { Component } from 'react';

class AddFriend extends Component {
    render() {
        return (
            <div className="container-wrap add-friend-block">
                <div className="container-middle container-content">
                    <div className="container-title">
                        添加好友
                        <i className="icon icon-close-addFriend icon-close">&#xe641;</i>
                    </div>
                    <div className="by-search-add-friend">
                        <input type="text" placeholder="手机号码添加" className="search-input">
                        <div className="search">
                                <i className="icon icon-search-friend">&#xe628;</i>
                        </div>
                    </div>
                    <ul className="friend-other-style">
                        <li>
                            <p>
                                <i className="icon icon-qq">&#xe601;</i>
                            </p>
                            <p className="icon-style-info">QQ</p>
                        </li>
                        <li>
                            <p>
                                <i className="icon icon-wechat">&#xe6f6;</i>
                            </p>
                            <p className="icon-style-info">微信</p>
                        </li>
                        <li className="by-code">
                            <p>
                                <i className="icon icon-ercode">&#xe619;</i>
                            </p>
                            <p className="icon-style-info">二维码</p>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default AddFriend;