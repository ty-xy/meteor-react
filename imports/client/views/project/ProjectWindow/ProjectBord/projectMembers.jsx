import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Modal } from 'antd';
import { Meteor } from 'meteor/meteor';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import Avatar from '../../../../components/Avatar';
import SelectMembers from '../../../../features/SelectMembers';
import Icon from '../../../../components/Icon';
import UserUtil from '../../../../../util/user';
import Company from '../../../../../schema/company';
import feedback from '../../../../../util/feedback';
import Project from '../../../../../../imports/schema/project';

const Search = Input.Search;

@pureRender
class projectMembers extends Component {
    static propTypes = {
        name: PropTypes.string,
        members: PropTypes.array,
        projectId: PropTypes.string,
        team: PropTypes.array,
        avatarColor: PropTypes.string,
        avatar: PropTypes.string,
        allMembers: PropTypes.arrayOf(PropTypes.object),
    }
    constructor(props) {
        super(props);
        this.state = {
            showSelect: false,
            // showList: false,
        };
    }
    handleAddMembers = () => {
        this.setState({
            showSelect: true,
        });
    }
    closeSelect = () => {
        this.setState({
            showSelect: false,
        });
    }
    handleDelete=() => {
    }
    handleShowList=(id) => {
        this.setState({
            [`showList${id}`]: !this.state[`showList${id}`],
        });
    }
    handleRemove=(id) => {
        feedback.dealDelete('提示', '确定要删除该成员吗?', () => this.deleteMember(id));
    }
    deleteMember = (id) => {
        const members = this.props.members;
        const index = members.indexOf(id);
        members.splice(index, 1);
        Meteor.call(
            'changeMembers', this.props.projectId, members, (err) => {
                console.log(err);
            },
        );
    }
    confirmSelected = (members) => {
        // console.log('选择加入的人员', members);
        const selectMembers = members;
        this.setState({
            selectMembersId: members,
            selectMembers: selectMembers.map(_id => Meteor.users.findOne({ _id })),
            showSelect: false,
        });
        let memberArrays = this.props.members.concat(members);
        console.log(memberArrays, members);
        memberArrays = Array.from(new Set(memberArrays));
        console.log(memberArrays, members);
        Meteor.call(
            'changeMembers', this.props.projectId, memberArrays, (err) => {
                console.log(err);
            },
        );
        if (members.length > 0) {
            members.forEach((value) => {
                if (value) {
                    Meteor.call(
                        'createProjectmember',
                        {
                            projectId: this.props.projectId,
                            member: value,
                            memberType: '2',
                        },
                        (err) => {
                            console.log(err);
                        },
                    );
                }
            });
        }
    }
    render() {
        return (
            <div className="project-members">
                <div className="member-title">项目成员</div>
                <div className="member-search">
                    <Search
                        placeholder="input search text"
                        style={{ width: 200 }}
                        onSearch={value => console.log(value)}
                    />
                </div>
                <ul>
                    <li className="p-m-list">
                        <p className="people-avatar">
                            <Avatar
                                avatarColor={this.props.avatarColor}
                                name={this.props.name}
                                avatar={this.props.avatar}
                            />
                        </p>
                        <p>{this.props.name}</p>
                        <p className="p-c-o">
                           创建者
                        </p>

                    </li>
                    {this.props.allMembers.length ?
                        this.props.allMembers.map(user => (
                            <li className="p-m-list" key={user._id} onClick={() => this.handleShowList(user._id)}>
                                <div className="try" style={{ display: this.state[`showList${user._id}`] ? 'block' : 'none' }} />
                                <p className="people-avatar">
                                    <Avatar
                                        key={user._id}
                                        avatarColor={user.profile && user.profile.avatarColor}
                                        name={user.profile && user.profile.name}
                                        avatar={user.profile && user.profile.avatar}
                                    />
                                </p>
                                <p>{user.profile.name}</p>
                                <div
                                    style={{ marginLeft: '210px', lineHeight: '70px' }}
                                >
                                    {/* <Dropdown overlay={menu} trigger={['click']}> */}
                                    <Icon icon="icon-gengduo" onClick={() => this.handleShowList(user._id)} />
                                    {this.state[`showList${user._id}`] ?
                                        <div className="members-delete-total">
                                            <div className="triangle-up" />
                                            <div className="members-delete" onClick={() => this.handleRemove(user._id)}>
                                            移除项目成员
                                            </div>
                                        </div> : null}
                                    {/* </Dropdown > */}
                                </div>
                            </li>))
                        : null
                    }
                </ul>
                <div className="ejianlian-add-projectf">
                    <div className="add-button add-button-save" onClick={this.handleAddMembers}>
                                     邀请新成员
                    </div>
                    {
                        this.state.showSelect ?
                            <Modal
                                title="选择人员"
                                visible
                                onCancel={this.closeSelect}
                                width={430}
                                footer={null}
                            >
                                <SelectMembers
                                    confirmSelected={this.confirmSelected}
                                    team={this.props.team}
                                />
                            </Modal>
                            :
                            null
                    }
                </div>
            </div>
        );
    }
}
export default withTracker((member) => {
    Meteor.subscribe('users');
    Meteor.subscribe('company');
    Meteor.subscribe('project');
    const projectId = member.projectId;
    const projectBuilder = Project.findOne({ uprojectId: projectId }).creater;
    const friendIds = UserUtil.getFriends();
    const companyIds = UserUtil.getCompanyList();
    const companyList = companyIds.map(_id =>
        Company.findOne({ _id }),
    );
    const teamValueL = companyList.map((item) => {
        const teamValue = {};
        const members = [];
        for (const value of Object.values(item.members)) {
            members.push(value.userId);
        }
        console.log(members);
        teamValue.name = item.name;
        teamValue.members = members;
        teamValue.department = [];
        return teamValue;
    });
    teamValueL.unshift({
        name: 'e建联好友',
        members: friendIds,
        department: [], // 不存在的时候需要传一个空数组
    });
    const team = teamValueL;
    const { profile = {} } = Meteor.users.findOne({ _id: projectBuilder }) || {};
    const { name = '', avatarColor = '', avatar = '' } = profile;
    console.log(profile);
    return {
        name,
        team,
        avatarColor,
        avatar,
        allMembers: Meteor.users.find({ _id: { $in: member.member } }).fetch(),
    };
})(projectMembers);
