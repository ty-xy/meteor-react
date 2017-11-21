import React, { PureComponent } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Col, Row, Button, Table, Icon } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import feedback from '../../../../util/feedback';
import UserUtil from '../../../../util/user';
import Company from '../../../../../imports/schema/company';


import MyModel from './component/AddDep';
import RightHeader from './component/RightHeader';

class Organization extends PureComponent {
    static propTypes = {
        company: PropTypes.object,
        users: PropTypes.Array,
    }
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
        const _id = UserUtil.getCompany();
        Meteor.call(
            'addDepartment',
            { ...info, _id },
            (err) => {
                if (err) {
                    feedback.dealError('添加失败');
                    return false;
                }
                feedback.successToast('添加成功');
            },
        );
        console.log(';info', info);
    }
    // handleSetting
    handleSetting = () => {
        this.setState({
            handleSetting: true,
        });
    }
    // 左侧新增部门
    addDepCompoennt = () => (
        <div className="e-mg-organization-card text-center e-mg-organization-addDep">
            <div>
                <i className="iconfont icon-Shape" onClick={() => this.addDepModel(true)} />
                <p onClick={() => this.addDepModel(true)}>新增部门</p>
            </div>
            <MyModel
                title="新增部门"
                handleResult={this.handleResult}
                addDepModel={this.addDepModel}
                postAddDep={this.postAddDep}
                {...this.state}
            />
        </div>
    )
    // 左侧部门选择
    organizationLeft = (deps, user) => {
        const { depActive, showMenu } = this.state;
        const num = {};
        user.forEach((item) => {
            if (num[item.dep]) {
                const res = num[item.dep] + 1;
                num[item.dep] = res;
            } else {
                num[item.dep] = 1;
            }
        });
        deps.forEach((item) => {
            item.num = num[item.name] || 0;
        });
        console.log('num', deps, user);
        return (
            <div className="e-mg-organization-left-dep margin-top-20">
                <div className={classnames('e-mg-organization-company', { 'dep-active': depActive === '' })}>
                    <a href="" onClick={e => this.handleTabDep(e, '')}><img src="http://oxldjnom8.bkt.clouddn.com/avatar_DQn6qYhEH3PejeDJf_1510912617360.png" alt="" />中亿集团有限公司 （{user.length || 0}）</a>
                    <i className={classnames('iconfont icon-jiantou-copy', { arrowDown: showMenu })} onClick={this.showMenu} />
                </div>
                {
                    showMenu ? (
                        <div className="dep">
                            {
                                deps.map(item => (<a href="" key={item.name} className={classnames('dep-a', { 'dep-active': depActive === item.name })} onClick={e => this.handleTabDep(e, item.name)}>{item.name} <span>{item.num || 0}</span></a>))
                            }
                        </div>
                    ) : null
                }
            </div>
        );
    }
    // 操作按钮集合
    handleBtns = () => {
        // const { isCompony } = this.state;
        console.log('handleBtns');
        return (
            <div className="handle-btns clearfix">
                <Button>新增员工</Button>
                <Button>邀请员工</Button>
                <Button>调整员工</Button>
            </div>
        );
    }
    // table列表
    tableList = () => {
        // const {} = this.state;
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
        }, {
            title: '性别',
            dataIndex: 'sex',
        }, {
            title: '职务',
            dataIndex: 'pos',
        }, {
            title: '部门',
            dataIndex: 'dep',
        }, {
            title: '手机号',
            dataIndex: 'phone',
        }, {
            title: '操作',
            dataIndex: '',
            render: () => (
                <span className="">
                    <i className="iconfont icon-bianji1 margin-right-20" title="编辑" />
                    <Icon type="close" title="删除" />
                </span>
            ),
        }];
        const data = [{
            key: '1',
            name: 'John Brown',
            sex: '男',
            pos: '主管',
            dep: '财务部',
            phone: '13478237283',
        }];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
        };
        return (
            <Table columns={columns} rowSelection={rowSelection} dataSource={data} pagination={false} />
        );
    }
    render() {
        console.log('this.props', this.props);
        const { deps = [] } = this.props.company;
        const { users = [] } = this.props;
        return (
            <div className="e-mg-organization">
                <Row gutter={30} type="flex" justify="space-between" align="stretch">
                    <Col span={6} className="e-mg-organization-left">
                        {this.addDepCompoennt()}
                        {this.organizationLeft(deps, users)}
                    </Col>
                    <Col span={18} className="e-mg-organization-card e-mg-organization-right clearfix">
                        <RightHeader name="中亿集团有限公司" handleSetting={this.handleSetting} />
                        {this.handleBtns()}
                        {this.tableList()}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('company');
    const companys = Company.find().fetch();
    let users = [];
    let company = {};
    const mainCompany = UserUtil.getCompany();
    for (let i = 0; i < companys.length; i++) {
        if (companys[i]._id === mainCompany) {
            users = companys[i].members;
            company = companys[i];
            break;
        }
    }
    return {
        users,
        company,
    };
})(Organization);
