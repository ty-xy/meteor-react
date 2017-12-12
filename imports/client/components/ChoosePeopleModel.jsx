import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Modal, Select, Row, Tag, Checkbox, Button } from 'antd';
import { withTracker } from 'meteor/react-meteor-data';
import Company from '../../schema/company';
import UserUtil, { userIdToInfo } from '../../util/user';

const Option = Select.Option;


const colors = [
    '#7986CB', '#4DB6AC', '#9575CD', '#F06292',
];

class ChoosePeopleModel extends (PureComponent || Component) {
    state = {
        visible: false,
        users: [],
        deps: [],
        companyInfo: {
            members: [],
            deps: [],
        },
        leftUsers: [],
        componentSelectedUser: [],
    }
    componentWillReceiveProps(nextProps) {
        const { members = [], deps = [] } = nextProps.companyInfo || {};
        const users = members.filter(item => (item.userId !== Meteor.userId()));
        const _users = [];
        let _deps = deps;
        const leftUsers = [];
        if (nextProps.defaultValue.length) {
            if (!nextProps.isSelecteGroup) {
                users.forEach((j) => {
                    for (let i = 0, item = nextProps.defaultValue; i < item.length; i++) {
                        if (item[i] === j.userId) {
                            j.selected = true;
                            leftUsers.push(j.userId);
                            break;
                        } else {
                            j.selected = false;
                        }
                    }
                    _users.push(j);
                });
            } else {
                _deps = [];
                const companyDep = {
                    ...nextProps.companyInfo,
                    members: members.map(item => (item.userId)),
                    selected: false,
                    id: nextProps.companyInfo._id,
                    isAutoChat: true,
                };
                deps.forEach((j) => {
                    for (let i = 0, item = nextProps.defaultValue; i < item.length; i++) {
                        if (item[i] === j.id) {
                            j.selected = true;
                            leftUsers.push(item[i]);
                            break;
                        } else if (item[i] === companyDep.id) {
                            companyDep.selected = true;
                        } else {
                            j.selected = false;
                        }
                    }
                    if (j.members.indexOf(Meteor.userId()) > -1) {
                        _deps.push(j);
                    }
                });
                _deps.unshift(companyDep);
            }

            this.setState({
                users: _users,
                deps: _deps,
                leftUsers,
            });
        } else {
            _deps = [];
            users.forEach((j) => { j.selected = false; });
            deps.forEach((j) => {
                if (j.members.indexOf(Meteor.userId()) > -1) {
                    j.selected = false;
                    _deps.push(j);
                }
            });
            const companyDep = {
                ...nextProps.companyInfo,
                members: members.map(item => (item.userId)),
                selected: false,
                id: nextProps.companyInfo && nextProps.companyInfo._id,
                isAutoChat: true,
            };
            _deps.unshift(companyDep);
            this.setState({
                users,
                deps: _deps,
                leftUsers,
            });
        }
    }
    // 切换群组
    onSecondDepChange = (value) => {
        const { users } = this.state;
        let depnum = 0;
        let depnumd = 0;
        if (value === undefined) {
            users.forEach((item) => {
                depnum++;
                if (item.selected) {
                    depnumd++;
                }
            });
            this.setState({
                depVal: value,
                checked: depnumd === depnum,
            });
        } else {
            users.forEach((item) => {
                if (item.dep === value) {
                    depnum++;
                    if (item.selected) {
                        depnumd++;
                    }
                }
            });
            this.setState({
                depVal: value,
                checked: depnum === depnumd,
            });
        }
    }
    handleOk = () => {
        this.setState({
            visible: false,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
            checked: false,
        });
    }
    // 选中人
    handleChange = (e, id) => {
        if (typeof e === 'object') {
            e.preventDefault();
        } else {
            id = e;
        }
        const users = [];
        let allNum = 0;
        const leftUsers = this.state.leftUsers;
        this.state.users.forEach((item) => {
            if (item.userId === id) {
                item.selected = !item.selected;
                const isNot = leftUsers.indexOf(id);
                if (isNot > -1) {
                    leftUsers.splice(isNot, 1);
                } else {
                    leftUsers.push(id);
                }
            }
            if (item.selected) {
                allNum++;
            }
            users.push(item);
        });
        if (allNum < this.state.users.length) {
            this.setState({ users, checked: false, allNum, leftUsers });
        } else {
            this.setState({ users, checked: true, allNum, leftUsers });
        }
    }
    // 选中群组
    handleGroupChange = (e, id) => {
        e.preventDefault();
        let allNum = 0;
        const { deps } = this.state;
        const _dep = [];
        const leftUsers = this.state.leftUsers;
        deps.forEach((item) => {
            if (item.id === id) {
                item.selected = !item.selected;
                const isNot = leftUsers.indexOf(id);
                if (isNot > -1) {
                    leftUsers.splice(isNot, 1);
                } else {
                    leftUsers.push(id);
                }
            }
            if (item.selected) {
                allNum++;
            }
            _dep.push(item);
        });
        if (allNum < deps.length) {
            this.setState({ checked: false, allNum, leftUsers });
        } else {
            this.setState({ checked: true, allNum, leftUsers });
        }
    }
    // 全选
    handleCheckbox = (e) => {
        let allNum = 0;
        const { users, checked, depVal, deps } = this.state;
        const { isSelecteGroup } = this.props;
        const _users = [];
        let leftUsers = this.state.leftUsers;
        const _dep = [];
        if (isSelecteGroup) {
            leftUsers = [];
            deps.forEach((item) => {
                if (e.target.checked === true) {
                    allNum++;
                    item.selected = true;
                    leftUsers.push(item.id);
                } else {
                    allNum--;
                    item.selected = false;
                    leftUsers = [];
                }
                _dep.push(item);
            });
            this.setState({
                checked: !checked,
                deps: _dep,
                allNum,
                leftUsers,
            });
        } else {
            if (!depVal) {
                leftUsers = [];
                users.forEach((item) => {
                    if (e.target.checked === true) {
                        item.selected = true;
                        leftUsers.push(item.userId);
                        allNum++;
                    } else {
                        item.selected = false;
                        leftUsers = [];
                    }
                    _users.push(item);
                });
            } else {
                users.forEach((item) => {
                    if (item.dep === depVal) {
                        if (e.target.checked === true) {
                            allNum++;
                            item.selected = true;
                            const isNot = leftUsers.indexOf(item.userId);
                            if (isNot > -1) {
                                leftUsers.splice(isNot, 1);
                            } else {
                                leftUsers.push(item.userId);
                            }
                        } else {
                            allNum--;
                            item.selected = false;
                            leftUsers = [];
                        }
                    }
                    _users.push(item);
                });
            }
            this.setState({
                checked: !checked,
                users: _users,
                allNum,
                leftUsers,
            });
        }
    }
    // 选中的人
    getSelected = (keyword) => {
        this.setState({ componentSelectedUser: this.state.leftUsers, visible: false });
        this.props.ok(keyword, this.state.leftUsers);
    }
    getAvatar = (allUsers, userId, index) => {
        const avatar = userIdToInfo.getAvatar(allUsers, userId);
        const name = userIdToInfo.getName(allUsers, userId);
        if (avatar) {
            return (<img src={avatar} alt="" />);
        }
        return <span style={{ background: colors[index % 4], color: '#FFF' }} className="e-mg-audit-deps-people-per-img e-mg-audit-deps-people-per-span">{(name || '').substr(-2, 3)}</span>;
    }
    // 获取群组avatar
    getDepAvatar = (id) => {
        const { deps } = this.state;
        let avatar = '';
        deps.forEach((item, index) => {
            if (item.id === id) {
                if (item.avatar) {
                    avatar = (<img src={item.avatar} alt="" />);
                } else {
                    avatar = <span style={{ background: colors[index % 4], color: '#FFF' }} className="e-mg-audit-deps-people-per-img e-mg-audit-deps-people-per-span">{item.name}</span>;
                }
            }
        });
        return avatar;
    }
    render() {
        const { allUsers, keyword, isSelecteGroup, modelTitle } = this.props;
        const { name } = this.props.companyInfo || {};
        const { depVal, users, deps, checked, allNum, leftUsers } = this.state;
        // isSelecteGroup 是否为选择群组
        // 用户列表
        const searchUser = (data) => {
            if (depVal) {
                return data.map((item, index) => {
                    if (item.dep === depVal) {
                        return (
                            <a key={item.userId} href="" className="e-mg-audit-deps-people-per" onClick={e => this.handleChange(e, item.userId)}>
                                {this.getAvatar(allUsers, item.userId, index)}
                                {item.selected ? <i className="iconfont icon-xuanze e-mg-audit-deps-people-icon" /> : null}
                                <span>{userIdToInfo.getName(allUsers, item.userId)}</span>
                            </a>
                        );
                    }
                    return null;
                });
            }
            return data.map((item, index) => (
                <a key={item.userId} href="" className="e-mg-audit-deps-people-per" onClick={e => this.handleChange(e, item.userId)}>
                    {this.getAvatar(allUsers, item.userId, index)}
                    {item.selected ? <i className="iconfont icon-xuanze e-mg-audit-deps-people-icon" /> : null}
                    <span>{userIdToInfo.getName(allUsers, item.userId)}</span>
                </a>
            ));
        };
        const searchDep = () => (
            deps.map(item => (
                <a key={item.name} href="" className="e-mg-audit-deps-people-per" onClick={e => this.handleGroupChange(e, item.id)}>
                    {this.getDepAvatar(item.id)}
                    {item.selected ? <i className="iconfont icon-xuanze e-mg-audit-deps-people-icon" /> : null}
                    <span>{item.name}</span>
                </a>
            ))
        );
        // getDepartmentName 获取部门名称
        const getDepartmentName = (id) => {
            let depname = '';
            for (let i = 0; i < deps.length; i++) {
                if (deps[i].id === id) {
                    depname = deps[i].name;
                    break;
                }
            }
            return depname;
        };
        return (
            <div>
                {this.props.children}
                <Modal
                    title={(<p className="text-center">{modelTitle}</p>)}
                    visible={this.props.visible}
                    onCancel={e => this.props.cancel(e, keyword)}
                    footer={null}
                    className="e-mg-audit-xuanze"
                    width="700px"
                    maskClosable={false}
                >
                    <Row className="e-mg-audit-xuanze-row">
                        <div className="e-mg-audit-xuanze-left e-mg-audit-xuanze-col">
                            {
                                isSelecteGroup ? leftUsers.map(item => (<Tag key={item} closable className="margin-bottom-20" onClose={() => this.handleGroupChange(item)}>{getDepartmentName(item)}</Tag>))
                                    :
                                    leftUsers.map(item => (<Tag key={item} closable className="margin-bottom-20" onClose={() => this.handleChange(item)}>{userIdToInfo.getName(allUsers, item)}</Tag>))
                            }
                        </div>
                        <div className="e-mg-audit-xuanze-right e-mg-audit-xuanze-col">
                            <div className="margin-left-20" style={{ color: '#15b4f1', fontSize: '14px', marginBottom: '10px' }}>{name}</div>
                            {
                                isSelecteGroup ? null : (
                                    <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                        <span className="margin-left-20">部门：</span>
                                        <Select allowClear style={{ width: '80%', marginLeft: '5px' }} placeholder="选择部门搜索" onChange={this.onSecondDepChange}>
                                            {
                                                deps.map(item => <Option key={item.name} value={item.id}>{item.name}</Option>)
                                            }
                                        </Select>
                                    </div>
                                )
                            }
                            <div className="e-mg-audit-deps-people margin-top-20">
                                <Checkbox checked={checked} onChange={e => this.handleCheckbox(e, isSelecteGroup)} style={{ marginLeft: '10px', marginBottom: '10px' }}>全选</Checkbox>
                                {
                                    isSelecteGroup ? searchDep(depVal) : searchUser(users)
                                }
                            </div>
                        </div>
                    </Row>
                    <Row className="text-center margin-top-20 e-mg-audit-xuanze-footer" style={{ margin: '20px -15px -15px' }}>
                        <Button type="primary" disabled={!allNum} onClick={() => this.getSelected(keyword)}>提交</Button>
                    </Row>
                </Modal>
            </div>
        );
    }
}
ChoosePeopleModel.propTypes = {
    form: PropTypes.object,
    keyword: PropTypes.string,
    requiredErr: PropTypes.string,
    required: PropTypes.bool,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    selectValue: PropTypes.string,
    width: PropTypes.string,
    selectedValue: PropTypes.array,
    isSelectedFalseTitleDes: PropTypes.string,
    modelTitle: PropTypes.string,
    offset: PropTypes.number,
    iconTitle: PropTypes.string,
    formItemLayout: PropTypes.object,
    isSelecteGroup: PropTypes.bool,
    children: PropTypes.object,
};
export default withTracker(() => {
    Meteor.subscribe('company');
    Meteor.subscribe('users');
    const companys = Company.find({ _id: UserUtil.getMainCompany() }).fetch();
    return {
        companyInfo: Company.findOne({ _id: UserUtil.getMainCompany() }),
        companys,
        allUsers: Meteor.users.find().fetch(),
    };
})(ChoosePeopleModel);

