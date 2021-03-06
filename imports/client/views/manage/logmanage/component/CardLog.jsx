import React from 'react';
import { Col } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import format from 'date-format';
import { Meteor } from 'meteor/meteor';
import { userIdToInfo } from '../../../../../util/user';

const colors = [
    '#7986CB', '#4DB6AC', '#9575CD', '#F06292',
];


const CardLog = ({ edit, delLog, editLog, finish, plan, type, index, nickname, help, _id, createdAt = new Date(), allUsers }) => (
    <Col className="e-mg-log-card">
        <div className="e-mg-log-card-header clearfix">
            <Col span={16}>
                {userIdToInfo.getAvatar(allUsers, Meteor.userId()) ?
                    <img src={userIdToInfo.getAvatar(allUsers, Meteor.userId()) || '无头像'} width="36" />
                    : <span className="e-mg-log-card-noAvatar" style={{ background: colors[index % 4] }}>{(nickname || '').substr(-2, 3)}</span>
                }
                <span className="e-mg-log-card-header-left">{nickname}</span>
            </Col>
            <Col span={8} className="e-mg-log-card-header-right">{type}</Col>
        </div>
        <div className="e-mg-log-card-body">
            <p><span>已完成工作：</span>{finish ? finish.replace(/<br\/>/g, '') : '暂无输入'}</p>
            <p><span>未完成工作：</span>{plan ? plan.replace(/<br\/>/g, '') : '暂无输入'}</p>
            <p><span>需协调工作：</span>{help ? help.replace(/<br\/>/g, '') : '暂无输入'}</p>
        </div>
        <div className="e-mg-log-card-footer clearfix">
            <Col span={12}>{format('yyyy-MM-dd', createdAt)}</Col>
            {
                edit ? (<Col span={12} className="right">
                    <a href="" onClick={e => delLog(e, _id)}>删除</a>
                    <a href="" onClick={e => editLog(e, _id, type)} className="margin-left-10">修改</a>
                    <Link className="margin-left-10" to={{ pathname: `/manage/logging/detail/${_id}` }}>详情</Link>
                </Col>)
                    : (<Col span={12} className="right"><Link to={{ pathname: `/manage/logging/detail/${_id}` }}>详情</Link></Col>)
            }
        </div>
    </Col>
);

CardLog.propTypes = {
    edit: PropTypes.bool,
    delLog: PropTypes.func,
    _id: PropTypes.string,
    editLog: PropTypes.func,
    finish: PropTypes.string,
    plan: PropTypes.string,
    help: PropTypes.string,
    type: PropTypes.string,
    nickname: PropTypes.string,
    createdAt: PropTypes.object,
    allUsers: PropTypes.array,
    index: PropTypes.number,
};

export default CardLog;
