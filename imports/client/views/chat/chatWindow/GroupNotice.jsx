import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import format from 'date-format';

import Icon from '../../../components/Icon';
import feedback from '../../../../util/feedback';

@pureRender
class GroupNotice extends Component {
    static propTypes = {
        handleGroupNotice: PropTypes.func,
        admin: PropTypes.string,
        notice: PropTypes.string,
        groupId: PropTypes.string,
        noticeTime: PropTypes.object,
    }
    constructor(...args) {
        super(...args);
        this.state = {
            isEdit: false,
            showNotice: this.props.notice.length > 0,
        };
    }
    editNotice = () => {
        this.setState({
            isEdit: true,
            showNotice: true,
        });
    }
    saveGroupNotice = () => {
        Meteor.call('editGroupNotice', this.props.groupId, this.$notice.value, (err) => {
            feedback.dealError(err);
            feedback.dealSuccess('发布成功');
        });
    }
    render() {
        const { handleGroupNotice, admin, notice, noticeTime } = this.props;
        return (
            <div className="container-wrap group-notice">
                <div className="opacity" onClick={handleGroupNotice} />
                <div className="container-wrap-right">
                    <div className="container-title">
                        群公告
                        <Icon icon="icon-guanbi  icon-close" onClick={handleGroupNotice} size={20} />
                    </div>
                    {
                        this.state.showNotice ?
                            <div className="notice-content">
                                <div className="notice-time">{format('yyyy-MM-dd', noticeTime)}</div>
                                <div>
                                    {
                                        this.state.isEdit ?
                                            <textarea name="" id="" cols="30" rows="10" className="notice" defaultValue={notice} ref={i => this.$notice = i} />
                                            :
                                            <div className="notice">
                                                {notice}
                                            </div>
                                    }
                                </div>
                            </div>
                            :
                            <div className="no-content">
                                暂无公告
                            </div>
                    }

                    {
                        admin === Meteor.userId() ?
                            <div className="notice-btn">
                                {
                                    this.state.isEdit ?
                                        <div className="deal-notice">
                                            <button className="send-notice" onClick={this.saveGroupNotice}>发布</button>
                                            <button className="cancel-notice" onClick={handleGroupNotice}>取消</button>
                                        </div>
                                        :
                                        <button onClick={this.editNotice}>编辑公告</button>
                                }

                            </div>
                            :
                            null
                    }

                </div>
            </div>
        );
    }
}

export default GroupNotice;

