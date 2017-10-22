import React, { Component, PureComponent } from 'react';
import { Col, Row, Card } from 'antd';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import LeftCard from './component/LeftCard';
import ManageRoute from './routes';
import Company from '../../../schema/company';

let i = 0;

class Manage extends (PureComponent || Component) {
    constructor(props) {
        super(props);
        this.state = {
            // companys: [
            //     { id: '23', name: '中亿装饰中亿装饰' },
            //     { id: '22', name: '博彩装亿装饰' },
            // ],
            // 按钮组
            btns: [
                { key: 'checking', name: '考勤', icon: 'icon-kaoqin--', url: '/manage/checking' },
                { key: 'logging', name: '日志', icon: 'icon-ribao', url: '/manage/logging' },
                { key: 'notice', name: '公告', icon: 'icon-gonggao', url: '/manage/notice' },
                { key: 'audit', name: '审批', icon: 'icon-shenpi-', url: '/manage/audit' },
                { key: 'netdisk', name: '网盘', icon: 'icon-wangpancopy', url: '/manage/netdisk' },
                { key: 'forms', name: '表单', icon: 'icon-biaodan', url: '/manage/forms' },
            ],
        };
    }
    componentWillMount() {
        // if (this.props.companys.length <= 0) {
        //     this.addCompany();
        // }
    }
    addCompany = (id) => {
        Meteor.call(
            'createCompany',
            {
                name: 'test',
                createdAt: new Date(),
                id,
            },
            (err) => {
                if (err) {
                    return console.error(err.reason);
                }
                // this.$message.value = '';
            });
    }
    clickCompany = (key) => {
        console.error('e', key);
        i++;
        this.addCompany(`${i}`);
    }
    render() {
        console.error('companys', this.props);
        return (
            <Row className="e-mg-container" gutter={50}>
                <LeftCard {...this.props} {...this.context} {...this.state} changeCompany={this.clickCompany} />
                <Col span={18} className="e-mg-right">
                    <Card bordered={false} style={{ height: '100%' }}>
                        <ManageRoute />
                    </Card>
                </Col>
            </Row>
        );
    }
}

Manage.contextTypes = {
    location: PropTypes.object,
    history: PropTypes.object,
};

export default withTracker(() => {
    Meteor.subscribe('company');
    return {
        companys: Company.find().fetch(),
    };
})(Manage);
