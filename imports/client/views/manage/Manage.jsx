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
            // 按钮组
            btns: [
                { key: 'checking', name: '考勤', icon: 'icon-kaoqin', url: '/manage/checking' },
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
    addCompany = (e) => {
        e.preventDefault();
        i++;
        Meteor.call(
            'createCompany',
            {
                name: `公司${i}`,
                createdAt: new Date(),
            },
            (err) => {
                if (err) {
                    return console.error(err.reason);
                }
                // this.$message.value = '';
            });
    }
    clickCompany = (id) => {
        console.log('切换公司', id);
        Meteor.users.update(
            Meteor.userId(),
            {
                $set: {
                    'profile.mainCompany': id,
                },
            },
        );
    }
    // 更新部门
    updateDepartment = (e) => {
        e.preventDefault();
        console.log('更新部门');
        const _id = Meteor.user().profile.mainCompany;
        const res = {
            deparment: '财政部',
            _id,
        };
        Meteor.call(
            'updateDepartment',
            res,
            (err) => {
                if (err) {
                    console.log(err);
                }
            },
        );
    }
    // 更新部门
    updateMember = (e) => {
        e.preventDefault();
        console.log('更新部门');
        const _id = Meteor.user().profile.mainCompany;
        const res = {
            member: '4HApvk4bZLigRvWrq',
            _id,
        };
        Meteor.call(
            'updateMember',
            res,
            (err) => {
                if (err) {
                    console.log(err);
                }
            },
        );
    }
    // 更新部门人员
    updateMemberDep = (e) => {
        e.preventDefault();
        console.log('更新部门');
        const _id = Meteor.user().profile.mainCompany;
        const res = {
            member: '4HApvk4bZLigRvWrq',
            department: '财政部',
            _id,
        };
        Meteor.call(
            'updateMemberDep',
            res,
            (err) => {
                if (err) {
                    console.log(err);
                }
            },
        );
    }
    render() {
        // console.log('allCompanys', this.props);
        return (
            <Row className="e-mg-container" gutter={50}>
                <a href="" onClick={this.addCompany}>add company</a>
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
    history: PropTypes.object,
    location: PropTypes.object,
};

export default withTracker(() => {
    Meteor.subscribe('company');
    return {
        users: Meteor.user() || {},
        allCompanys: Company.find().fetch(),
    };
})(Manage);
