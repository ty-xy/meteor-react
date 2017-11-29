import React, { PureComponent } from 'react';
import { Col, Row, Button, Input, Icon } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import MyModel from '../../../manage/audit/component/MyModel';

let k = 0;

class Invite extends PureComponent {
    static propTypes = {
        postInvite: PropTypes.func,
        modelDep: PropTypes.bool,
        companyId: PropTypes.string,
        dep: PropTypes.string,
        groupId: PropTypes.string,
    }
    constructor(props) {
        super(props);
        this.state = {
            nums: [0],
        };
    }
    // 取消
    handleCancel = () => {
        const { nums } = this.state;
        const req = {};
        const values = {};
        for (let i = 0; i < nums.length; i++) {
            req[`require-${nums[i]}`] = false;
            values[`phone${nums[i]}`] = '';
        }
        k = 0;
        this.setState({ nums: [0], ...req, ...values }, () => {
            this.props.postInvite(false, 'inviteModel');
        });
    }
    handleInput = (e, i) => {
        this.setState({ [`phone${i}`]: e.target.value, [`require-${i}`]: false });
    }
    // 确认邀请提交
    handleCommentbtn = () => {
        const { nums } = this.state;
        const req = {};
        const values = {};
        const phons = [];
        let noSubmit = false;
        for (let i = 0; i < nums.length; i++) {
            if (!this.state[`phone${nums[i]}`]) {
                req[`require-${nums[i]}`] = true;
                noSubmit = true;
            } else {
                phons.push(this.state[`phone${nums[i]}`]);
            }
        }
        if (noSubmit) {
            this.setState(req);
        } else {
            for (let i = 0; i < nums.length; i++) {
                req[`require-${nums[i]}`] = false;
                values[`phone${nums[i]}`] = '';
            }
            k = 0;
            this.setState({ nums: [0], ...values, ...req });
            this.props.postInvite(false, 'inviteModel', phons);
        }
    }
    // 增加输入框
    addPhoneInput = () => {
        k++;
        const newNums = this.state.nums;
        newNums.push(k);
        this.setState({ nums: newNums, k });
    }
    // 删除输入框
    delInput = (item) => {
        const newNums = this.state.nums;
        const pos = newNums.indexOf(item);
        newNums.splice(pos, 1);
        this.setState({ nums: newNums, [`phone${item}`]: '', radom: Math.random() });
    }
    copyText = () => {
        this.yourForm.focus();
        this.yourForm.select();
    }
    // urls
    urls = () => {
        const { companyId, dep, groupId } = this.props;
        const { origin } = window.location;
        const pathname = '/login';
        const w = `${origin}${pathname}`;
        if (companyId && dep && groupId) {
            return `${w}?companyId=${companyId}&dep=${dep}&groupId=${groupId}`;
        } else if (companyId && groupId) {
            return `${w}?companyId=${companyId}&groupId=${groupId}`;
        } else if (companyId) {
            return `${w}?companyId=${companyId}`;
        } else if (companyId && dep) {
            return `${w}?companyId=${companyId}&dep=${dep}`;
        }
    }
    render() {
        const { nums } = this.state;
        const { modelDep } = this.props;
        return (
            <MyModel
                handleCancel={this.handleCancel}
                show={modelDep}
                title="邀请员工"
                animation="vertical"
                mask={modelDep}
                handleCommentbtn={this.handleCommentbtn}
                height="auto"
                footer={<div />}
            >
                <div className="clearfix e-mg-model-comment" style={{ height: 'auto' }}>
                    {
                        nums.map((item, index) => (
                            <div className="ant-row ant-form-item ant-form-item-with-help margin-bottom-20" key={item}>
                                <div className="ant-col-6 ant-form-item-label">
                                    <label htmlFor="username" className="ant-form-item-required" title="Name">手机号码{index + 1}</label>
                                </div>
                                <div className="ant-col-14 ant-form-item-control-wrapper">
                                    <div className={classnames('ant-form-item-control', { 'has-error': this.state[`required-${item}`] })}>
                                        <Input value={this.state[`phone${item}`]} onChange={e => this.handleInput(e, item)} placeholder="请填写手机号码邀请" ref={i => this.depname = i} />
                                        {this.state[`require-${item}`] ? <div className="ant-form-explain text-left" style={{ color: '#f04134' }}>请填写手机号码</div> : null}
                                    </div>
                                </div>
                                {nums.length > 1 ? <div className="ant-col-3 text-center"><Icon type="minus-circle-o" onClick={() => this.delInput(item)} /></div> : null}
                            </div>
                        ))
                    }
                    <Row className="margin-top-20">
                        <Col offset={6} span={14} className="text-center"><Button className="e-invite-button" onClick={this.addPhoneInput}>添加更多</Button></Col>
                        <Col offset={6} span={14} className="text-center margin-top-20"><Button className="e-mg-button e-invite-button" onClick={this.handleCommentbtn}>确认邀请</Button></Col>
                        <Col span={24} className="text-center margin-top-20">通过下方链接邀请</Col>
                        <Col span={24} className="text-center margin-top-20">
                            <textarea name="yourForm" readOnly value={this.urls()} ref={i => this.yourForm = i} style={{ width: '100%', textAlign: 'center', minHeight: '50px', lineHeight: '1.3' }} />
                        </Col>
                        <Col span={24} className="text-center margin-top-20">
                            <Button className="e-mg-button" onClick={this.copyText}>复制链接</Button>
                        </Col>
                    </Row>
                </div>
            </MyModel>
        );
    }
}

export default Invite;
