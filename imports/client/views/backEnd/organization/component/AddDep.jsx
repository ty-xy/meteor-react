import React, { PureComponent } from 'react';
import { Col, Row, Checkbox, Input } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import MyModel from '../../../manage/audit/component/MyModel';


class AddDep extends PureComponent {
    static propTypes = {
        addDepModel: PropTypes.func,
        postAddDep: PropTypes.func,
        modelDep: PropTypes.bool,
    }
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    // 取消
    handleCancel = () => {
        this.setState({ isAutoChat: false, name: '', required: false }, () => {
            this.props.addDepModel(false, 'commentModel');
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
        if (!name) {
            this.setState({ required: true });
        } else {
            this.setState({ name: '', isAutoChat: false });
            this.props.postAddDep({ name, isAutoChat });
        }
    }

    render() {
        const { required, name, isAutoChat } = this.state;
        const { modelDep } = this.props;
        console.log('adddep', this.props, this.state);
        return (
            <MyModel
                handleCancel={this.handleCancel}
                show={modelDep}
                title="新增部门"
                animation="vertical"
                mask={modelDep}
                handleCommentbtn={this.handleCommentbtn}
                height="269px"
            >
                <div className="clearfix e-mg-model-comment">
                    <div className="ant-row ant-form-item ant-form-item-with-help">
                        <div className="ant-col-6 ant-form-item-label">
                            <label htmlFor="username" className="ant-form-item-required" title="Name">部门名称</label>
                        </div>
                        <div className="ant-col-14 ant-form-item-control-wrapper">
                            <div className={classnames('ant-form-item-control', { 'has-error': required })}>
                                <Input value={name} onChange={this.handleInput} placeholder="请填写部门名称（必填）" ref={i => this.depname = i} />
                                {required ? <div className="ant-form-explain">请填写部门名称</div> : null}
                            </div>
                        </div>
                    </div>
                    <Row className="margin-top-20">
                        <Col span={6} className="text-right margin-right-10"><Checkbox onChange={e => this.handleInput(e, 'checkout')} checked={isAutoChat} /></Col>
                        <Col span={14} className="text-left">生成部门群组,该部门所有成员自动加入该群新加入成员亦是。</Col>
                    </Row>
                </div>
            </MyModel>
        );
    }
}

export default AddDep;
