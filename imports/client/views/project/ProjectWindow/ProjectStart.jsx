import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';

@pureRender
export default class ProjectStart extends Component {
    render() {
        return (
            <div className="empty-chat-wrap">
                <div className="empty-chat ">
                    <p>开启您的团队协作之旅</p>
                    <img src="http://cdn.zg18.com/start.png" alt="" />
                </div>
            </div>
        );
    }
}
