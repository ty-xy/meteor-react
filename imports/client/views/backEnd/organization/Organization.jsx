import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';
import classnames from 'classnames';

class Organization extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            depActive: '',
        };
    }
    handleTabDep = (e, depActive) => {
        e.preventDefault();
        this.setState({ depActive });
    }
    // 公司部门收起
    showMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    }
    render() {
        const { depActive, showMenu } = this.state;
        return (
            <div className="e-mg-organization">
                <Row gutter={16} type="flex" justify="space-between" align="stretch">
                    <Col span={6} className="e-mg-organization-left">
                        <div className="e-mg-organization-card text-center e-mg-organization-addDep">
                            <a href="">
                                <i className="iconfont icon-Shape" />
                                <p>新增部门</p>
                            </a>
                        </div>
                        <div className="e-mg-organization-left-dep margin-top-20">
                            <a href="" className={classnames('e-mg-organization-company', { 'dep-active': depActive === '' })} onClick={e => this.handleTabDep(e, '')}>
                                <img src="http://oxldjnom8.bkt.clouddn.com/avatar_DQn6qYhEH3PejeDJf_1510912617360.png" alt="" />
                                中亿集团有限公司
                                <i className={classnames('iconfont icon-jiantou-copy', { arrowDown: showMenu })} onClick={this.showMenu} />
                                <span>23</span>
                            </a>
                            {
                                showMenu ? (
                                    <div>
                                        <a href="" className={classnames({ 'dep-active': depActive === '财政部' })} onClick={e => this.handleTabDep(e, '财政部')}>财政部 <span>6</span></a>
                                        <a href="" className={classnames({ 'dep-active': depActive === '技术部' })} onClick={e => this.handleTabDep(e, '技术部')}>技术部 <span>2</span></a>
                                        <a href="" className={classnames({ 'dep-active': depActive === '设计部' })} onClick={e => this.handleTabDep(e, '设计部')}>设计部 <span>4</span></a>
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
