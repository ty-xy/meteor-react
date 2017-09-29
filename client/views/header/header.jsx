import React, { Component } from 'react';

import '../../styles/header.less';

class Header extends Component {
    render() {
        return (
            <div className="ejianlianHeader">
                <div className="ejianlian-header-bar">
                    <div className="ejianlian-header-logo">
                        <img src='/logo.png'/>
                    </div>
                    <div className="ejianlian-header-bar-tab">
                        <ul className="header-bar-tab">
                            <li className="header-tab chat">消息</li>
                            <li className="header-tab chat">项目</li>
                            <li className="header-tab chat">管理</li>
                            <li className="header-tab chat">百科</li>
                        </ul>
                    </div>
                    <ul className="ejianlian-header-account">
                        {/* <li className="header-search-all">
                            <input type="text" placeholder="请输入关键词"/>>
                            <span className="close-search">X</span>
                        </li> */}
                        <li>
                            <i className="icon icon-ejianlain-search">&#xe628;</i>
                        </li>
                        <li className="icon-all-notice">
                            <p className="icon-notice-redDot"></p>
                            <i className="icon icon-ejianlain-notice">&#xe65e;</i>
                        </li>
                        <li>
                            <i className="icon icon-ejianlain-pc">&#xe77c;</i>
                        </li>
                        <li className="admin-account">
                            <p className="account-avatar">
                                <img src="http://wenwen.soso.com/p/20110819/20110819165923-448451987.jpg" alt=""/>
                            </p>
                        </li>
                    </ul>

                </div>
            </div>
        );
    }
}

export default Header;

