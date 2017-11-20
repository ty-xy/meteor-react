import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';
import classnames from 'classnames';

import MyModel from './component/AddDep';

class Organization extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            depActive: '',
            commentModel: false,
        };
    }
    handleTabDep = (e, depActive) => {
        console.log('handleTabDep');
        e.preventDefault();
        this.setState({ depActive });
    }
    // 公司部门收起
    showMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    }
    // 添加部门model
    addDepModel = (bool) => {
        this.setState({ commentModel: bool });
    }
    // 新增部门提交
    postAddDep = (info) => {
        this.setState({
            commentModel: false,
        });
        console.log(';info', info);
    }
    render() {
        const { depActive, showMenu } = this.state;
        return (
            <div className="e-mg-organization">
                <Row gutter={30} type="flex" justify="space-between" align="stretch">
                    <Col span={6} className="e-mg-organization-left">
                        <div className="e-mg-organization-card text-center e-mg-organization-addDep">
                            <div>
                                <i className="iconfont icon-Shape" onClick={() => this.addDepModel(true)} />
                                <p onClick={() => this.addDepModel(true)}>新增部门</p>
                            </div>
                        </div>
                        <MyModel
                            title="新增部门"
                            handleResult={this.handleResult}
                            addDepModel={this.addDepModel}
                            postAddDep={this.postAddDep}
                            {...this.state}
                        />
                        <div className="e-mg-organization-left-dep margin-top-20">
                            <div className={classnames('e-mg-organization-company', { 'dep-active': depActive === '' })}>
                                <a href="" onClick={e => this.handleTabDep(e, '')}><img src="http://oxldjnom8.bkt.clouddn.com/avatar_DQn6qYhEH3PejeDJf_1510912617360.png" alt="" />中亿集团有限公司 （23）</a>
                                <i className={classnames('iconfont icon-jiantou-copy', { arrowDown: showMenu })} onClick={this.showMenu} />
                            </div>
                            {
                                showMenu ? (
                                    <div className="dep">
                                        <a href="" className={classnames('dep-a', { 'dep-active': depActive === '财政部' })} onClick={e => this.handleTabDep(e, '财政部')}>财政部 <span>6</span></a>
                                        <a href="" className={classnames('dep-a', { 'dep-active': depActive === '技术部' })} onClick={e => this.handleTabDep(e, '技术部')}>技术部 <span>2</span></a>
                                        <a href="" className={classnames('dep-a', { 'dep-active': depActive === '设计部' })} onClick={e => this.handleTabDep(e, '设计部')}>设计部 <span>4</span></a>
                                    </div>
                                ) : null
                            }
                        </div>
                    </Col>
                    <Col span={18} className="e-mg-organization-card e-mg-organization-right">
                        <div className="e-mg-organization-content">中亿集团有限公司</div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Organization;
