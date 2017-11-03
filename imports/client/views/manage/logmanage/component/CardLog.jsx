import React from 'react';
import { Col } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const types = {
    day: '日报',
    week: '周报',
    month: '月报',
    business: '营业日报',
};

const CardLog = ({ edit, delLog, editLog, finish, plan, type, nickname, help, _id }) => (
    <Col className="e-mg-log-card">
        <div className="e-mg-log-card-header">
            <Col span={16}>
                <img src="http://k2.jsqq.net/uploads/allimg/1706/7_170629152344_5.jpg" width="56px" alt="" />
                <span className="e-mg-log-card-header-left">{nickname}</span>
            </Col>
            <Col span={8} className="e-mg-log-card-header-right">{types[type]}</Col>
        </div>
        <div className="e-mg-log-card-body">
            <p><span>已完成工作：</span>{finish}</p>
            <p><span>未完成工作：</span>{plan}</p>
            <p><span>需协调工作：</span>{help}</p>
        </div>
        <div className="e-mg-log-card-footer">
            <Col span={12}>07月26日</Col>
            {
                edit ? (<Col span={12} className="right">
                    <a href="" onClick={e => delLog(e, _id)}>删除</a>
                    <a href="" onClick={e => editLog('#write', e, _id)} className="margin-left-10">修改</a></Col>)
                    : (<Col span={12} className="right"><Link to={{ pathname: '/manage/logging/detail', state: { edit, delLog, editLog, finish, plan, type, nickname, help, _id } }}>查看详情</Link></Col>)
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
};

export default CardLog;
