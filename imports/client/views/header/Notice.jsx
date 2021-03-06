import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

import Icon from '../../components/Icon';

@pureRender
class Notice extends Component {
    render() {
        return (
            <div className="container-wrap-right">
                <div className="container-title">
                    通知
                    <Icon icon="icon-guanbi icon icon-close-codeBlock icon-close" onClick={this.props.handleNotice} />
                </div>
                {/* 工作和项目通知 */}
                <div className="ejianlian-chat-message-list">
                    <div className="chat-user-pannel">
                        <div className="work-notice-redDot" />
                        <div className="user-avatar">
                            <img src="http://www.qq1234.org/uploads/allimg/150709/8_150709170804_6.jpg" alt="" />
                        </div>
                        <div className="user-message">
                            <p>工作通知—「审批」<span className="message-createAt">2017-10-27</span></p>
                            <p className="last-message">老徐的请假申请需要您审批，
                                <span style={{ color: '#29b6f6' }}>请查看</span>
                            </p>
                        </div>
                    </div>
                    <div className="chat-user-pannel ">
                        <div className="work-notice-redDot" />
                        <div className="user-avatar">
                            <img src="http://www.qq1234.org/uploads/allimg/150709/8_150709170804_6.jpg" alt="" />
                        </div>
                        <div className="user-message">
                            <p>工作通知—「审批」<span className="message-createAt">2017-10-01</span></p>
                            <p className="last-message">老徐的请假申请需要您审批，
                                <span style={{ color: '#29b6f6' }}>请查看</span>
                            </p>
                        </div>
                    </div>
                    <div className="chat-user-pannel">
                        <div className="work-notice-redDot" />
                        <div className="user-avatar">
                            <img src="http://img.qq1234.org/uploads/allimg/150608/8_150608172703_6.jpg" alt="" />
                        </div>
                        <div className="user-message">
                            <p>项目通知<span className="message-createAt">2017-09-30</span></p>
                            <p className="last-message">老徐的请假申请需要您审批，
                                <span style={{ color: '#29b6f6' }}>请查看</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
Notice.propTypes = {
    handleNotice: PropTypes.func,
};
export default Notice;
