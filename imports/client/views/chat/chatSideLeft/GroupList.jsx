import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';

import Icon from '../../../components/Icon';

@pureRender
class GroupList extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            isShowCompany: false,
            isShowMyGroup: false,
        };
    }
    handleShowCompany = () => {
        this.setState({
            isShowCompany: !this.state.isShowCompany,
        });
    }
    handleShowMyGroup = () => {
        this.setState({
            isShowMyGroup: !this.state.isShowMyGroup,
        });
    }
    render() {
        return (
            <div className="ejianlian-chat-group-list">
                <div className="chat-friend-pannel">
                    <div className="friend-pannel-list">
                        <div className="friend-list-item">
                            <p>
                                <img src="http://img.duoziwang.com/2016/10/02/15235311191.jpg" alt="" />
                            </p>
                            <p className="friend-name" style={{ borderWidth: this.state.isShowCompany ? '0px' : '1px' }}>中艺装饰
                                {
                                    this.state.isShowCompany ?
                                        <Icon icon="icon-xiangshangjiantou-copy-copy-copy icon" onClick={this.handleShowCompany} />
                                        :
                                        <Icon icon="icon-jiantou-copy icon" onClick={this.handleShowCompany} />
                                }
                            </p>
                        </div>
                        <div style={{ display: this.state.isShowCompany ? 'none' : 'block' }}>
                            <div className="friend-list-item">
                                <p>
                                    <img src="http://img2.imgtn.bdimg.com/it/u=2273251608,3871271086&fm=214&gp=0.jpg" alt="" />
                                </p>
                                <p className="friend-name last-type-name">中艺装饰员工群</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="chat-friend-pannel">
                    <div className="friend-pannel-type" />
                    <div className="friend-pannel-list">
                        <div className="friend-list-item">
                            <p className="my-chat-group">
                                <i className="icon">&#xe624;</i>
                            </p>
                            <p className="friend-name" style={{ borderWidth: this.state.isShowMyGroup ? '0px' : '1px' }}>
                                我的群聊
                                {
                                    this.state.isShowMyGroup ?
                                        <Icon icon="icon-xiangshangjiantou-copy-copy-copy icon" onClick={this.handleShowMyGroup} />
                                        :
                                        <Icon icon="icon-jiantou-copy icon" onClick={this.handleShowMyGroup} />
                                }
                            </p>
                        </div>
                        <div style={{ display: this.state.isShowMyGroup ? 'none' : 'block' }}>
                            <div className="friend-list-item">
                                <p>
                                    <img src="http://img.duoziwang.com/2016/10/02/15235311191.jpg" alt="" />
                                </p>
                                <p className="friend-name last-type-name">#13项目组</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default GroupList;
