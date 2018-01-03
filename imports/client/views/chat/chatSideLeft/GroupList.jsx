import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Menu } from 'antd';

import Icon from '../../../components/Icon';
import Avatar from '../../../components/Avatar';
import UserUtil from '../../../../util/user';
import Group from '../../../../schema/group';
import Company from '../../../../schema/company';
import avatarUrl from '../../../../util/avatarUrl';

const SubMenu = Menu.SubMenu;
@pureRender
class GroupList extends Component {
    static propTypes = {
        handleClick: PropTypes.func,
        selfGroups: PropTypes.array,
        teamGroups: PropTypes.array,
        history: PropTypes.object,
    };
    constructor(...args) {
        super(...args);
        this.state = {
            isShowCompany: false,
            isShowMyGroup: false,
        };
    }
    // 跳转到chat
    handleToChat = (id) => {
        this.props.handleClick();
        this.props.history.push({ pathname: `/chat/${id}/window`, state: { type: 'group' } });
    }
    handleShowCompany = () => {
        this.setState({
            isShowCompany: !this.state.isShowCompany,
        });
    }
    handleShowMyGroup = () => {
        this.setState({
            isShowMyGroup: !this.state.isShowMyGroup,
        });
    }

    renderSubMenu = (departments) => {
        if (departments && departments.length) {
            return departments.map(department => (department.members.indexOf(Meteor.userId())) > -1 && <Menu.Item key={department._id}>{department.name}<span className="department-mask">部门</span></Menu.Item>,
            );
        }
    }
    renderTeam = company => <Menu.Item key={company._id}>{company.name}<span className="team-mask">团队</span></Menu.Item>
    renderTeamTitle = (name, logo) => <div className="team-title"><Avatar name="企业" avatarColor="red" avatar={logo} /><p>{name}</p></div>
    render() {
        return (
            <div className="ejianlian-chat-group-list">
                <div className="chat-friend-pannel">
                    {
                        this.props.teamGroups[0] ?
                            <div className="friend-pannel-type" />
                            :
                            null
                    }
                    <div className="team-organization">
                        <Menu
                            onClick={e => this.handleToChat(e.key)}
                            mode="inline"
                            className="team-menu"
                        >
                            {
                                this.props.teamGroups[0] && this.props.teamGroups.map(company =>
                                    (<SubMenu
                                        title={this.renderTeamTitle(company.name, company.avatar)}
                                        key={company._id}
                                    >
                                        {this.renderTeam(company)}
                                        {
                                            this.renderSubMenu(company.subGroup)
                                        }
                                    </SubMenu>
                                    ),
                                )
                            }
                        </Menu>
                    </div>
                    <div className="friend-pannel-type" />
                    <div className="friend-pannel-list">
                        <div className="friend-list-item">
                            <p className="my-chat-group">
                                <Icon icon="icon-qunzu icon" />
                            </p>
                            <p className="friend-name" style={{ borderWidth: this.state.isShowMyGroup ? '0px' : this.props.selfGroups.length > 0 ? '1px' : '0px' }}>
                                我的群聊
                                {
                                    this.state.isShowMyGroup ?
                                        <Icon icon="icon-xiangshangjiantou-copy-copy-copy icon" onClick={this.handleShowMyGroup} />
                                        :
                                        <Icon icon="icon-jiantou-copy icon" onClick={this.handleShowMyGroup} />
                                }
                            </p>
                        </div>
                        <div style={{ display: this.state.isShowMyGroup ? 'none' : 'block' }}>
                            {
                                this.props.selfGroups.map((item, index) => (
                                    item ?
                                        <div
                                            key={index}
                                            className="friend-list-item"
                                            onClick={() => this.handleToChat(item._id)}
                                        >
                                            <p>
                                                <Avatar name={item.name} avatar={item.avatar ? item.avatar : avatarUrl.avatarGroup} />
                                            </p>
                                            <p className={this.props.selfGroups.length - 1 !== index ? 'friend-name' : 'friend-name last-type-name'}>{item.name}</p>
                                        </div>
                                        :
                                        null
                                ),
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('group');
    Meteor.subscribe('company');
    const groupIds = UserUtil.getGroups();
    const groups = groupIds.map(_id => Group.findOne({ _id }));
    const selfGroups = groups.filter(x => x && (x.type === 'group' || x.type === undefined)); // 之后数据库重新更新后,要删掉对undefined的判断
    const teamGroups = groups.filter(x => x && (x.type === 'team' && x.companyId));
    teamGroups.forEach((team) => {
        const companyInfo = Company.findOne({ _id: team.companyId });
        const subGroupIds = companyInfo && companyInfo.subGroupIds;
        if (subGroupIds) {
            team.subGroup = [];
            subGroupIds.forEach((subGroupId) => {
                if (Group.findOne({ _id: subGroupId })) {
                    team.subGroup.push(Group.findOne({ _id: subGroupId }));
                }
            });
        }
    });
    console.log('teamGroups', teamGroups);
    return {
        selfGroups,
        teamGroups,
    };
})(GroupList);
