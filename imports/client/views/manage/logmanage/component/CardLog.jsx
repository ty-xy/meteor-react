import React from 'react';
import { Col } from 'antd';
// import PropTypes from 'prop-types';


const CardLog = () => (
    <Col className="e-mg-log-card">
        <div className="e-mg-log-card-header">
            <Col span={12}>
                <img src="http://k2.jsqq.net/uploads/allimg/1706/7_170629152344_5.jpg" width="56px" alt="" />
                <span className="e-mg-log-card-header-left">汤恩伯</span>
            </Col>
            <Col span={12} className="e-mg-log-card-header-right">日报</Col>
        </div>
        <div className="e-mg-log-card-body">
            <p><span>已完成工作：</span>的就是大家</p>
            <p><span>已完成工作：</span>的就是大家</p>
            <p><span>已完成工作：</span>的就是大家</p>
        </div>
        <div className="e-mg-log-card-footer">
            <Col span={12}>07月26日</Col>
            <Col span={12} className="right">删除 修改</Col>
        </div>
    </Col>
);
export default CardLog;
