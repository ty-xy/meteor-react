import React, { PureComponent } from 'react';
import { Col, Row, Button, Input } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import MyModel from '../../../manage/audit/component/MyModel';
import feedback from '../../../../../util/feedback';


class Invite extends PureComponent {
    static propTypes = {
        addDepModel: PropTypes.func,
        postInvite: PropTypes.func,
        modelDep: PropTypes.bool,
        deps: PropTypes.array,
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    // 取消
    handleCancel = () => {
        this.setState({ isAutoChat: false, name: '', required: false }, () => {
            this.props.addDepModel(false, 'inviteModel');
        });
    }
    handleInput = (e, name) => {
        if (name === 'checkout') {
            this.setState({ isAutoChat: e.target.checked });
        } else {
            this.setState({ name: e.target.value, require: false });
        }
    }
    // 新增部门提交
    handleCommentbtn = () => {
        const { name, isAutoChat = false } = this.state;
        const { deps } = this.props;
        if (!name) {
            this.setState({ required: true });
        } else {
            let isHas = false;
            for (let i = 0; i < deps.length; i++) {
                if (deps[i].name === name) {
                    isHas = true;
                }
            }
            if (!isHas) {
                this.props.postInvite({ name, isAutoChat });
            } else {
                feedback.dealWarning('该部门已经存在， 请注意查看');
                this.props.addDepModel(false, 'inviteModel');
            }
            this.setState({ name: '', isAutoChat: false });
        }
    }

    render() {
        const { required, name } = this.state;
        const { modelDep } = this.props;
        return (
            <MyModel
                handleCancel={this.handleCancel}
                show={modelDep}
                title="邀请员工"
                animation="vertical"
                mask={modelDep}
                handleCommentbtn={this.handleCommentbtn}
                height="320px"
                footer={<div />}
            >
                <div className="clearfix e-mg-model-comment">
                    <div className="ant-row ant-form-item ant-form-item-with-help margin-bottom-20">
                        <div className="ant-col-6 ant-form-item-label">
                            <label htmlFor="username" className="ant-form-item-required" title="Name">手机号码</label>
                        </div>
                        <div className="ant-col-14 ant-form-item-control-wrapper">
                            <div className={classnames('ant-form-item-control', { 'has-error': required })}>
                                <Input value={name} onChange={this.handleInput} placeholder="请填写手机号码邀请" ref={i => this.depname = i} />
                                {required ? <div className="ant-form-explain text-left">请填写手机号码</div> : null}
                            </div>
                        </div>
                    </div>
                    <Row className="margin-top-20">
                        <Col span={24} className="text-center"><Button className="e-invite-button">添加更多</Button></Col>
                        <Col span={24} className="text-center margin-top-20"><Button className="e-mg-button e-invite-button">确认邀请</Button></Col>
                        <Col span={24} className="text-center margin-top-20">通过下方链接邀请</Col>
                        <Col span={24} className="text-center margin-top-20">https://zhigong.com/invite/index?code=8f0ed9d4a7</Col>
                        <Col span={24} className="text-center margin-top-20">
                            <Button className="e-mg-button">复制链接</Button>
                        </Col>
                    </Row>
                </div>
            </MyModel>
        );
    }
}

export default Invite;
