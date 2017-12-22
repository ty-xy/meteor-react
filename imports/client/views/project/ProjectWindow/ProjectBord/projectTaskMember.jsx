import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import pureRender from 'pure-render-decorator';

import SelectMembers from '../../../../features/SelectMembers';
import Avatar from '../../../../components/Avatar';
import Task from '../../../../../../imports/schema/task';
import Project from '../../../../../../imports/schema/project';
// import AvatarSelf from '../../../../components/AvatarSelf';
import Icon from '../../../../components/Icon';
// import UserUtil from '../../../../../util/user';


@pureRender
class projectMembers extends Component {
    static propTypes = {
        // name: PropTypes.string,
        memberId: PropTypes.string,
        avatarColor: PropTypes.string,
        avatar: PropTypes.string,
        name: PropTypes.string,
        textId: PropTypes.string,
        team: PropTypes.array,
        TaskMembers: PropTypes.array,
        allMembers: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.object),
            PropTypes.string,
        ]),
    }
    constructor(props) {
        super(props);
        this.state = {
            showSelect: false,
        };
    }
    handleAddMembers = () => {
        this.setState({
            showSelect: true,
        });
    }
    handleRemoveMembers= (e, id) => {
        e.preventDefault();
        console.log(this.props.TaskMembers);
        const memberArrays = this.props.TaskMembers.filter(item => item !== id);
        Meteor.call(
            'changeTaskMembers', this.props.textId, memberArrays, (err) => {
                console.log(err);
            },
        );
    }
    closeSelect = () => {
        this.setState({
            showSelect: false,
        });
    }
    confirmSelected = (members) => {
        const selectMembers = members;
        this.setState({
            selectMembersId: members,
            selectMembers: selectMembers.map(_id => Meteor.users.findOne({ _id })),
            showSelect: false,
        });
        let memberArrays = this.props.TaskMembers.concat(members);
        memberArrays = Array.from(new Set(memberArrays));
        memberArrays = memberArrays.filter(item => item !== this.props.memberId);
        Meteor.call(
            'changeTaskMembers', this.props.textId, memberArrays, (err) => {
                console.log(err);
            },
        );
    }
    render() {
        return (
            <div className="detail-list-content-top" >
                <p>成员</p>
                <div style={{ display: 'flex' }}>
                    <div className="person-size">
                        <Avatar
                            avatarColor={this.props.avatarColor}
                            name={this.props.name}
                            avatar={this.props.avatar}
                        />
                    </div>
                    {
                        this.props.allMembers.length > 0 && this.props.allMembers.map(user => (
                            user ?
                                <div className="avatar-name" onClick={e => this.handleRemoveMembers(e, user._id)} key={user._id}>
                                    <Avatar
                                        key={user._id}
                                        avatarColor={user.profile && user.profile.avatarColor}
                                        name={user.profile && user.profile.name}
                                        avatar={user.profile && user.profile.avatar}
                                    />
                                </div>
                                :
                                null
                        ))
                    }
                    <Icon icon="icon-tianjia circle-icon" onClick={this.handleAddMembers} size={28} />
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
        );
    }
}
export default withTracker((member) => {
    Meteor.subscribe('users');
    Meteor.subscribe('project');
    const TaskMembers = Task.findOne({ textId: member.textId }) ? Task.findOne({ textId: member.textId }).taskMembers : [];
    const creater = Project.findOne({ uprojectId: member.projectId }).creater;
    const Members = Project.findOne({ uprojectId: member.projectId }).members;
    Members.unshift(creater);
    const team = [
        {
            name: '选择人员',
            members: Members,
            department: [], // 不存在的时候需要传一个空数组
        },
    ];
    console.log(member, TaskMembers, creater);
    const { profile = {} } = Meteor.users.findOne({ _id: member.memberId }) || {};
    const { name = '', avatarColor = '', avatar = '' } = profile;
    return {
        name,
        team,
        avatarColor,
        avatar,
        TaskMembers: TaskMembers.length > 0 ? TaskMembers : [],
        allMembers: TaskMembers.length > 0 ? Meteor.users.find({ _id: { $in: TaskMembers } }).fetch() : '',
    };
})(projectMembers);
