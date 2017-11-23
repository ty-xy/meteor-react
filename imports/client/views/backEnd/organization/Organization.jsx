import React, { PureComponent } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Col, Row, Button, Table, Icon } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import feedback from '../../../../util/feedback';
import UserUtil, { userIdToInfo } from '../../../../util/user';
import Company from '../../../../../imports/schema/company';
import MyModel from './component/AddDep';
import AddMember from './component/AddMember';
import RightHeader from './component/RightHeader';
import SettingModel from './component/SettingModel';

class Organization extends PureComponent {
    static propTypes = {
        company: PropTypes.object,
        users: PropTypes.array,
        allUsers: PropTypes.array,
    }
    constructor(props) {
        super(props);
        this.state = {
            depActive: '',
            commentModel: false,
            selectedRows: [],
            selectedRowKeys: [],
            users: [],
        };
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.depActive) {
            console.log('componentWillReceiveProps');
            this.setState({ users: nextProps.users });
        }
    }
    settingModel = () => {
        console.log('settingModel');
        const { deps = [] } = this.props.company;
        const visitedDep = deps.filter(item => (item.name === this.state.depActive));
        return (
            <SettingModel
                modelShowHide={this.modelShowHide}
                handleSubmitMember={this.handleDepSetting}
                modelMember={this.state.settingModel}
                data={visitedDep.length ? visitedDep[0] : {}}
                handleDepDel={this.handleDepDel}
            />
        );
    }
    // 部门设置model
    handleSetting = () => {
        this.setState({
            settingModel: true,
        });
    }
    // 修改部门
    handleDepSetting = (fields) => {
        console.log('fields', fields);
        const { deps = [] } = this.props.company;
        const visitedDep = deps.filter(item => (item.name === this.state.depActive));
        const companyId = UserUtil.getCompany();
        Meteor.call(
            'editCompanyDep',
            { companyId, name, oldName: visitedDep[0] && visitedDep[0].name },
            (err) => {
                if (err) {
                    feedback.dealError('修改失败');
                    return false;
                }
                feedback.successToast('修改成功');
            },
        );
    }
    // 删除部门
    handleDepDel = (name) => {
        const companyId = UserUtil.getCompany();
        feedback.dealDelete('删除提醒', '此删除不可撤销，确认删除该部门吗？', () => {
            Meteor.call(
                'delCompanyDep',
                { companyId, name },
                (err) => {
                    if (err) {
                        feedback.dealError('删除失败');
                        return false;
                    }
                    feedback.successToast('删除成功');
                },
            );
        });
    }
    // 左侧dep切换
    handleTabDep = (e, depActive) => {
        e.preventDefault();
        const { users } = this.props;
        let res = [];
        console.log('depActive', depActive);
        if (depActive) {
            res = users.filter(item => (item.dep === depActive));
        } else {
            res = users;
        }
        this.setState({ depActive, users: res });
    }
    // 公司部门收起
    showMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    }
    // model 控制
    modelShowHide = (bool, name, editMemberInfo) => {
        if (editMemberInfo) {
            this.setState({ [name]: bool, editMemberInfo: {} });
        } else {
            this.setState({ [name]: bool });
        }
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
    }
    // 左侧新增部门
    addDepModel = () => (
        <div className="e-mg-organization-card text-center e-mg-organization-addDep">
            <div>
                <i className="iconfont icon-Shape" onClick={() => this.modelShowHide(true, 'commentModel')} />
                <p onClick={() => this.modelShowHide(true, 'commentModel')}>新增部门</p>
            </div>
            <MyModel
                title="新增部门"
                addDepModel={this.modelShowHide}
                postAddDep={this.postAddDep}
                modelDep={this.state.commentModel}
                deps={this.props.company.deps || []}
            />
        </div>
    )
    // 左侧部门列表
    depList = (deps, user) => {
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
        return (
            <div className="e-mg-organization-left-dep margin-top-20">
                <div className={classnames('e-mg-organization-company', { 'dep-active': depActive === '' })}>
                    <a href="" onClick={e => this.handleTabDep(e, '')}><img src="http://oxldjnom8.bkt.clouddn.com/avatar_DQn6qYhEH3PejeDJf_1510912617360.png" alt="" />中亿集团有限公司 （{user.length || 0}）</a>
                    <i className={classnames('iconfont icon-jiantou-copy', { arrowDown: showMenu })} onClick={this.showMenu} />
                </div>
                {
                    <div className={classnames('dep', { 'dep-hide': showMenu })}>
                        {
                            deps.map(item => (<a href="" key={item.name} className={classnames('dep-a', { 'dep-active': depActive === item.name })} onClick={e => this.handleTabDep(e, item.name)}>{item.name} <span>{item.num || 0}</span></a>))
                        }
                    </div>
                }
            </div>
        );
    }
    // 操作按钮集合
    handleBtns = () => (
        <div className="handle-btns clearfix">
            <Button onClick={() => this.modelShowHide(true, 'modelMember')}>新增员工</Button>
            <Button>邀请员工</Button>
            <Button>调整部门</Button>
        </div>
    );
    // 新增提交
    handleSubmitMember = (res, editMemberInfo) => {
        const companyId = UserUtil.getCompany();
        const { allUsers, users } = this.props;
        let isNot = false;
        let bool = false;
        const _this = this;
        users.forEach((item) => {
            if (item.username === res.phone) {
                isNot = true;
            }
        });
        if (editMemberInfo) {
            Meteor.call(
                'editMember',
                { ...res, userId: editMemberInfo, companyId },
                (err) => {
                    if (err) {
                        feedback.dealError('编辑失败');
                        return false;
                    }
                    feedback.successToastFb('编辑成功', () => {
                        _this.setState({ modelMember: false });
                    });
                },
            );
        } else if (isNot) {
            feedback.dealWarning('该人员已存在公司中， 请注意查看');
        } else {
            allUsers.forEach((item) => {
                if (item.username === res.phone) {
                    bool = true;
                    res.userId = item._id;
                }
            });
            if (bool) {
                Meteor.call(
                    'addMember',
                    { ...res, companyId },
                    (err) => {
                        if (err) {
                            feedback.dealError('添加失败');
                            return false;
                        }
                        feedback.successToastFb('添加成功', () => {
                            _this.setState({ modelMember: false });
                        });
                    },
                );
            } else {
                _this.setState({ modelMember: false });
                feedback.dealWarning((<p>该成员尚未注册, <span style={{ color: '#108ee9', cursor: 'pointer' }} onClick={_this.modelShowHide(true, 'inviteMember')}>立即邀请</span></p>));
            }
        }
    }
    // 新增成员renmodel
    addMembersModel = () => {
        const { company } = this.props;
        const { editMemberInfo = {} } = this.state;
        return (
            <AddMember
                modelShowHide={this.modelShowHide}
                handleSubmitMember={this.handleSubmitMember}
                modelMember={this.state.modelMember}
                data={company.deps || []}
                editMemberInfo={editMemberInfo}
            />
        );
    }
    // 编辑成员信息
    editMember = (editMemberInfo) => {
        editMemberInfo.username = userIdToInfo.getUsername(this.props.allUsers, editMemberInfo.userId);
        editMemberInfo.name = userIdToInfo.getName(this.props.allUsers, editMemberInfo.userId);
        this.setState({ editMemberInfo }, () => {
            this.modelShowHide(true, 'modelMember');
        });
    }
    // 删除成员
    delCompanyMember = (userId) => {
        feedback.dealDelete('删除提醒', '此删除不可撤销，确认删除该成员吗？', () => {
            const companyId = UserUtil.getCompany();
            Meteor.call(
                'delCompanyMember',
                { companyId, userId },
                (err) => {
                    if (err) {
                        feedback.dealError('删除失败');
                        return false;
                    }
                    feedback.successToast('删除成功');
                },
            );
        });
    }
    // table列表
    tableList = (users) => {
        const { allUsers } = this.props;
        const columns = [
            {
                title: '姓名',
                dataIndex: '',
                render: record => (userIdToInfo.getName(allUsers, record.userId)),
            }, {
                title: '职务',
                dataIndex: 'pos',
            }, {
                title: '部门',
                dataIndex: 'dep',
            }, {
                title: '手机号',
                dataIndex: '',
                render: record => (userIdToInfo.getUsername(allUsers, record.userId)),
            }, {
                title: '操作',
                dataIndex: '',
                render: record => (
                    <span className="">
                        <i className="iconfont icon-bianji1 margin-right-20" onClick={() => this.editMember(record)} title="编辑" />
                        <Icon type="close" title="删除" onClick={() => this.delCompanyMember(record.userId)} />
                    </span>
                ),
            },
        ];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({ selectedRows, selectedRowKeys });
            },
        };
        return (
            <Table rowKey={record => record.userId} columns={columns} rowSelection={rowSelection} dataSource={users} pagination={false} />
        );
    }
    // 人员部门切换model
    memberBelongModel = () => {
        console.log('memberBelongModel');
        return (
            <div />
        );
    }
    render() {
        console.log('this.props', this.props, this.state);
        const { deps = [] } = this.props.company;
        const { users } = this.state;
        return (
            <div className="e-mg-organization">
                <Row gutter={30} type="flex" justify="space-between" align="stretch">
                    <Col span={6} className="e-mg-organization-left">
                        {this.addDepModel()}
                        {this.depList(deps, this.props.users)}
                    </Col>
                    <Col span={18} className="e-mg-organization-card e-mg-organization-right clearfix">
                        <RightHeader name="中亿集团有限公司" handleSetting={this.handleSetting} {...this.state} />
                        {this.handleBtns()}
                        {this.tableList(users)}
                        {this.addMembersModel()}
                        {this.memberBelongModel()}
                        {this.settingModel()}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('company');
    Meteor.subscribe('users');
    const companys = Company.find().fetch();
    let users = [];
    let company = {};
    const mainCompany = UserUtil.getCompany();
    for (let i = 0; i < companys.length; i++) {
        if (companys[i]._id === mainCompany) {
            users = companys[i].members || [];
            company = companys[i];
            break;
        }
    }
    return {
        users,
        allUsers: Meteor.users.find().fetch(),
        company,
    };
})(Organization);
