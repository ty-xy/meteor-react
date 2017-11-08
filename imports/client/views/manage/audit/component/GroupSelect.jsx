import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Modal, Form, Col, Select, Row, Tag, Checkbox, Button } from 'antd';
import MyIcon from '../../../../components/Icon';
import Company from '../../../../../schema/company';
import { userIdToInfo } from '../../../../../util/user';

const Option = Select.Option;
const FormItem = Form.Item;


const colors = ['#7986CB', '#4DB6AC', '#9575CD', '#F06292'];

class GroupSelect extends (PureComponent || Component) {
    state = {
        visible: false,
        users: [],
        deps: [],
        companyInfo: {},
        leftUsers: [],
        componentSelectedUser: [],
    }
    componentWillMount() {
        const { companyInfo } = this.props;
        const { members = [], deps = [] } = companyInfo;
        console.log('componentWillMount', companyInfo);
        this.setState({
            users: members,
            deps,
            companyInfo,
        });
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
    showModal = (e) => {
        e.preventDefault();
        this.setState({
            visible: true,
        });
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
    handleGroupChange = (e, name) => {
        e.preventDefault();
        let allNum = 0;
        const { users, deps } = this.state;
        const _users = [];
        const _dep = [];
        let _depSele = {};
        deps.forEach((item) => {
            if (item.name === name) {
                item.selected = !item.selected;
                _depSele = item;
            }
            _dep.push(item);
        });
        users.forEach((item) => {
            if (item.dep === name) {
                if (_depSele.selected) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
            }
            if (item.selected) {
                allNum++;
            }
            _users.push(item);
        });
        if (allNum < users.length) {
            this.setState({ users: _users, checked: false, allNum, deps: _dep });
        } else {
            this.setState({ users: _users, checked: true, allNum, deps: _dep });
        }
    }
    // 全选
    handleCheckbox = (e) => {
        let allNum = 0;
        const { users, checked, depVal, deps } = this.state;
        const _users = [];
        let leftUsers = this.state.leftUsers;
        const _dep = deps;
        if (!depVal) {
            users.forEach((item) => {
                if (e.target.checked === true) {
                    item.selected = true;
                    leftUsers.push(item.userId);
                } else {
                    item.selected = false;
                    leftUsers = [];
                }
                _users.push(item);
            });
            _dep.forEach((item) => {
                if (e.target.checked === true) {
                    allNum = 1;
                    item.selected = true;
                } else {
                    allNum = 0;
                    item.selected = false;
                }
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
            deps: _dep,
            leftUsers,
        });
    }
    // 选中的人
    getTimeSelected = () => {
        const res = [];
        this.state.users.forEach((item) => {
            if (item.selected) {
                res.push(item.userId);
            }
        });
        return res;
    }
    // 选中的人
    getSelected = () => {
        this.setState({ componentSelectedUser: this.state.leftUsers, visible: false });
        return this.state.leftUsers;
    }
    getAvatar = (allUsers, userId) => {
        const avatar = userIdToInfo.getAvatar(allUsers, userId);
        const name = userIdToInfo.getName(allUsers, userId);
        if (avatar) {
            return (<img src={avatar} alt="" />);
        }
        return <span style={{ background: colors[Math.floor(Math.random() * 4)], color: '#FFF' }} className="e-mg-audit-deps-people-per-img e-mg-audit-deps-people-per-span">{name}</span>;
    }
    render() {
        // console.log('group', this.state, this.props);
        const { allUsers, keyword, label, required, selectedValue = [], isSelectedFalseTitle, isSelectedTrueTitle, modelTitle, isSelectedFalseTitleDes, requiredErr, getGroup, isSelecteGroup, offset, formItemLayout } = this.props;
        const { name } = this.props.companyInfo;
        const { depVal, users, deps, checked, allNum, leftUsers, componentSelectedUser } = this.state;
        // isSelecteGroup 是否为选择群组
        // 用户列表
        const searchUser = (data) => {
            if (depVal) {
                return data.map((item) => {
                    if (item.dep === depVal) {
                        return (
                            <a key={item.userId} href="" className="e-mg-audit-deps-people-per" onClick={e => this.handleChange(e, item.userId)}>
                                {this.getAvatar(allUsers, item.userId)}
                                {item.selected ? <i className="iconfont icon-xuanze e-mg-audit-deps-people-icon" /> : null}
                                <span>{userIdToInfo.getName(allUsers, item.userId)}</span>
                            </a>
                        );
                    }
                    return null;
                });
            }
            return data.map(item => (
                <a key={item.userId} href="" className="e-mg-audit-deps-people-per" onClick={e => this.handleChange(e, item.userId)}>
                    {this.getAvatar(allUsers, item.userId)}
                    {item.selected ? <i className="iconfont icon-xuanze e-mg-audit-deps-people-icon" /> : null}
                    <span>{userIdToInfo.getName(allUsers, item.userId)}</span>
                </a>
            ));
        };
        const searchDep = () => (
            deps.map(item => (
                <a key={item.name} href="" className="e-mg-audit-deps-people-per" onClick={e => this.handleGroupChange(e, item.name)}>
                    <span style={{ background: colors[Math.floor(Math.random() * 4)] }} className="e-mg-audit-deps-people-per-span">{item.name}</span>
                    {item.selected ? <i className="iconfont icon-xuanze e-mg-audit-deps-people-icon" /> : null}
                    <span>{item.name}</span>
                </a>
            ))
        );
        const formItems = () => {
            if (formItemLayout) {
                return (
                    <FormItem
                        {...formItemLayout}
                        label={label}
                        className="e-mg-audit-groupSelect"
                    >

                        {
                            selectedValue.length ? <p style={{ color: 'rgb(180, 180, 180)' }}>{isSelectedTrueTitle}</p> : <a href="" className="e-mg-audit-leave-a" onClick={this.showModal}>{isSelectedFalseTitle} <span style={{ color: '#ccc' }}>{isSelectedFalseTitleDes}</span></a>
                        }

                    </FormItem>
                );
            }
            return (
                <p>{label}: {
                    selectedValue.length ? <span style={{ color: 'rgb(180, 180, 180)' }}>{isSelectedTrueTitle}</span> : <a href="" className="e-mg-audit-leave-a" onClick={this.showModal}>{isSelectedFalseTitle} <span style={{ color: '#ccc' }}>{isSelectedFalseTitleDes}</span></a>
                }</p>
            );
        };
        return (
            <div style={{ marginBottom: '20px' }}>
                {formItems()}
                <Col offset={offset || 0} style={{ position: 'relative' }}>
                    {isSelecteGroup ?
                        deps.map((item) => {
                            if (item.selected) {
                                return (
                                    <a href="" key={item.name} onClick={e => this.handleGroupChange(e, item.name)} className="e-mg-audit-seleted-img">
                                        {this.getAvatar(item.avatar, item.name)}
                                        <p>{item.name}</p>
                                    </a>
                                );
                            }
                            return null;
                        }) :
                        componentSelectedUser.map(item => (
                            <a href="" key={item} onClick={e => this.handleChange(e, item)} className="e-mg-audit-seleted-img">
                                {this.getAvatar(allUsers, item)}
                                <p>{userIdToInfo.getName(allUsers, item)}</p>
                            </a>
                        ))
                    }
                    <span className="e-mg-audit-seleted-img">
                        <MyIcon icon="icon-tianjia3" size="36px" onClick={this.showModal} />
                        <p style={{ marginTop: '-6px' }}>{label}</p>
                        {required ? <span style={{ position: 'absolute',
                            top: '20px',
                            left: '60px',
                            color: '#EF5350',
                        }}
                        ><MyIcon icon="icon-cuowu" /> {requiredErr}!</span> : null}
                    </span>
                </Col>
                <Modal
                    title={(<p className="text-center">{modelTitle}</p>)}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="e-mg-audit-xuanze"
                    width="700px"
                    maskClosable={false}
                >
                    <Row className="e-mg-audit-xuanze-row">
                        <div className="e-mg-audit-xuanze-left e-mg-audit-xuanze-col">
                            {
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
                                                deps.map(item => <Option key={item.name} value={item.name}>{item.name}</Option>)
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
                        <Button type="primary" disabled={!allNum} onClick={() => getGroup(keyword, this.getSelected())}>提交</Button>
                    </Row>
                </Modal>
            </div>
        );
    }
}
GroupSelect.propTypes = {
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
};
export default withTracker(() => {
    Meteor.subscribe('company');
    Meteor.subscribe('users');
    const companys = Company.find().fetch();
    const mainCompany = Meteor.user() && Meteor.user().profile.mainCompany;
    let companyInfo = {};
    companys.forEach((item) => {
        if (item._id === mainCompany) {
            companyInfo = item;
        }
    });
    return {
        companyInfo,
        companys,
        allUsers: Meteor.users.find().fetch(),
    };
})(GroupSelect);

