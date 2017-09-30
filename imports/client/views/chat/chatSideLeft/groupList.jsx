import React, { Component } from 'react';

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
                                <i className="icon" style={{ display: this.state.isShowCompany ? 'none' : 'block' }} onClick={this.handleShowCompany}>&#xe690;</i>
                                <i className="icon" style={{ display: this.state.isShowCompany ? 'block' : 'none' }} onClick={this.handleShowCompany}>&#xe64f;</i>
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
                                <i className="icon" style={{ display: this.state.isShowMyGroup ? 'none' : 'block' }} onClick={this.handleShowMyGroup}>&#xe690;</i>
                                <i className="icon" style={{ display: this.state.isShowMyGroup ? 'block' : 'none' }} onClick={this.handleShowMyGroup}>&#xe64f;</i>
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
