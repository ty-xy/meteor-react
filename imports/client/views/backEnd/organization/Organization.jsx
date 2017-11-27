import React, { PureComponent } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Col, Row, Button, Table, Icon } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import uuid from 'uuid/v1';
import { Meteor } from 'meteor/meteor';
import feedback from '../../../../util/feedback';
import UserUtil, { userIdToInfo } from '../../../../util/user';
import Company from '../../../../../imports/schema/company';
import MyModel from './component/AddDep';
import AddMember from './component/AddMember';
import RightHeader from './component/RightHeader';
import SettingModel from './component/SettingModel';
import BatchSetDep from './component/BatchSetDep';

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
            showMenu: true,
        };
    }
    componentWillReceiveProps(nextProps) {
        if (!this.state.depActive) {
            console.log('componentWillReceiveProps');
            this.setState({ users: nextProps.users });
        }
    }
    // 部门设置model
    handleSetting = () => {
        this.setState({
            depsettingModel: true,
        });
    }
    // 修改部门
    handleDepSetting = ({ name }, id) => {
        const companyId = UserUtil.getCurrentBackendCompany();
        const { deps } = this.props.company;
        const _this = this;
        const visitedDep = deps.filter(item => (item.id === this.state.depActive));
        console.log('fields', { companyId, ...visitedDep, id, name });
        const DEV = visitedDep.length ? visitedDep[0] : {};
        Meteor.call(
            'editCompanyDep',
            { companyId, ...DEV, id, name },
            (err) => {
                if (err) {
                    feedback.dealError('修改失败');
                    return false;
                }
                feedback.successToastFb('修改成功', () => {
                    _this.setState({ depsettingModel: false });
                });
            },
        );
    }
    // 删除部门
    handleDepDel = (id, groupId, isAutoChat) => {
        const companyId = UserUtil.getCurrentBackendCompany();
        const { users } = this.props;
        const _this = this;
        let isDelete = true;
        users.forEach((item) => {
            if (item.dep === id) {
                isDelete = false;
            }
        });
        console.log('groupId', groupId);
        if (isDelete) {
            feedback.dealDelete('删除提醒', '此删除不可撤销，确认删除该部门吗？', () => {
                Meteor.call(
                    'delCompanyDep',
                    { companyId, id, groupId, isAutoChat },
                    (err) => {
                        if (err) {
                            feedback.dealError('删除失败');
                            return false;
                        }
                        feedback.successToastFb('删除成功', () => {
                            _this.setState({ depsettingModel: false });
                        });
                    },
                );
            });
        } else {
            feedback.dealWarning('该部门存在人员， 无法删除，请先移除或删除该部门人员');
            this.setState({ depsettingModel: false });
        }
    }
    // 左侧dep切换
    handleTabDep = (e, depActive) => {
        e.preventDefault();
        const { users } = this.props;
        let res = [];
        console.log('depActive', depActive, users);
        res = users.filter(item => (item.dep === depActive));
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
        // const _id = UserUtil.getMainCompany();
        const _id = 'ar9bP7gagx9vNqSRu';
        const id = uuid();
        Meteor.call(
            'addDepartment',
            { ...info, _id, id },
            (err, result) => {
                console.log('postAddDep', result);
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
        const { company } = this.props;
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
            item.num = num[item.id] || 0;
        });
        return (
            <div className="e-mg-organization-left-dep margin-top-20">
                <div className={classnames('e-mg-organization-company', { 'dep-active': depActive === '' })}>
                    <a href="" onClick={e => this.handleTabDep(e, '')}><img src={company.logo} alt="" />{company.name} （{user.length || 0}）</a>
                    <i className={classnames('iconfont icon-jiantou-copy', { arrowDown: showMenu })} onClick={this.showMenu} />
                </div>
                {
                    <div className={classnames('dep', { 'dep-hide': showMenu })}>
                        {
                            deps.map(item => (<a href="" key={item.id} className={classnames('dep-a', { 'dep-active': depActive === item.id })} onClick={e => this.handleTabDep(e, item.id)}>{item.name} <span>{item.num || 0}</span></a>))
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
            <Button onClick={this.depsetBatchDepModel}>调整部门</Button>
        </div>
    );
    // 新增人员提交
    handleSubmitMember = (res, editMemberInfo, oldgroup) => {
        const companyId = UserUtil.getCurrentBackendCompany();
        const { allUsers, users, company } = this.props;
        let isNot = false;
        let bool = false;
        let groupId = '';
        const _this = this;
        users.forEach((item) => {
            if (userIdToInfo.getUsername(allUsers, item.userId) === res.phone) {
                isNot = true;
            }
        });
        company.deps.forEach((item) => {
            if (item.id === res.dep) {
                groupId = item.groupId;
            }
        });
        company.deps.forEach((item) => {
            if (item.id === oldgroup) {
                oldgroup = item.groupId;
            }
        });
        // console.log('13614376223', company.deps, res, groupId, oldgroup);
        if (editMemberInfo) {
            Meteor.call(
                'editMember',
                { ...res, userId: editMemberInfo, companyId, groupId, oldgroup },
                (err) => {
                    if (err) {
                        feedback.dealError('编辑失败');
                        return false;
                    }
                    feedback.successToastFb('编辑成功', () => {
                        _this.setState({ modelMember: false, editMember: {}, editMemberInfo: {} });
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
                    { ...res, companyId, groupId },
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
    // 批量修改提交
    handleSubmitBatchDep = (fields) => {
        const { selectedRowKeys } = this.state;
        const { users, company } = this.props;
        const companyId = UserUtil.getCurrentBackendCompany();
        const _users = [];
        let oldgroup = '';
        let groupId = '';
        company.deps.forEach((item) => {
            if (item.id === users[0].dep) {
                oldgroup = item.groupId;
            }
            if (item.id === fields.dep) {
                groupId = item.groupId;
            }
        });
        users.forEach((item) => {
            if (selectedRowKeys.indexOf(item.userId) > -1) {
                item.dep = fields.dep;
                _users.push(item);
            }
        });
        const _this = this;
        console.log('_users', _users, fields, selectedRowKeys, groupId, oldgroup);
        Meteor.call(
            'batchSetDep',
            { companyId, _users, groupId, oldgroup },
            (err) => {
                if (err) {
                    feedback.dealError('批量设置失败');
                    return false;
                }
                feedback.successToastFb('批量设置成功', () => {
                    _this.setState({ modelBatchDep: false });
                });
            },
        );
    }
    // 部门设置model
    depsettingModel = () => {
        const { deps = [] } = this.props.company;
        const visitedDep = deps.filter(item => (item.id === this.state.depActive));
        return (
            <SettingModel
                modelShowHide={this.modelShowHide}
                handleSubmitMember={this.handleDepSetting}
                modelMember={this.state.depsettingModel}
                data={visitedDep.length ? visitedDep[0] : {}}
                handleDepDel={this.handleDepDel}
            />
        );
    }
    // 新增成员renmodel
    addMembersModel = () => {
        const { company, allUsers } = this.props;
        const { editMemberInfo = {} } = this.state;
        if (editMemberInfo.userId) {
            return (
                <AddMember
                    modelShowHide={this.modelShowHide}
                    handleSubmitMember={this.handleSubmitMember}
                    modelMember={this.state.modelMember}
                    data={company.deps || []}
                    editMemberInfo={editMemberInfo}
                    allUsers={allUsers}
                />
            );
        }
        return (
            <AddMember
                modelShowHide={this.modelShowHide}
                handleSubmitMember={this.handleSubmitMember}
                modelMember={this.state.modelMember}
                data={company.deps || []}
                editMemberInfo={editMemberInfo}
                allUsers={allUsers}
                key={12}
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
            const companyId = UserUtil.getCurrentBackendCompany();
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
        const { deps = [] } = this.props.company;
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
                render: (dep) => {
                    let name = '';
                    for (let i = 0; i < deps.length; i++) {
                        if (deps[i].id === dep) {
                            name = deps[i].name;
                            break;
                        }
                    }
                    return name;
                },
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
                this.setState({ selectedRows, selectedRowKeys });
            },
        };
        return (
            <Table rowKey={record => record.userId} columns={columns} rowSelection={rowSelection} dataSource={users} pagination={false} />
        );
    }
    // 批量切换部门
    memberBelongModel = () => {
        const { allUsers } = this.props;
        const { deps = [] } = this.props.company;
        return (
            <BatchSetDep
                modelShowHide={this.modelShowHide}
                handleSubmitBatchDep={this.handleSubmitBatchDep}
                modelMember={this.state.modelBatchDep}
                data={deps}
                allUsers={allUsers}
            />
        );
    }
    // 打开批量设置model
    depsetBatchDepModel = () => {
        if (this.state.selectedRowKeys.length) {
            this.modelShowHide(true, 'modelBatchDep');
        } else {
            feedback.dealWarning('至少选择一个成员');
        }
    }
    render() {
        const { deps = [] } = this.props.company;
        const { users } = this.props;
        const { depActive } = this.state;
        let data = [];
        if (depActive) {
            data = users.filter(item => (item.dep === this.state.depActive));
        } else {
            data = users.filter(item => (!item.dep));
        }
        // console.log('render', this.props, this.state, data);
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
                        {this.tableList(data)}
                        {this.addMembersModel()}
                        {this.memberBelongModel()}
                        {this.depsettingModel()}
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
    const mainCompany = UserUtil.getCurrentBackendCompany();
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
