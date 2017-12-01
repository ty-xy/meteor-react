import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { Meteor } from 'meteor/meteor';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import AvatarSelf from '../../../../components/AvatarSelf';

// import SelectMembers from '../../../../features/SelectMembers';
import Icon from '../../../../components/Icon';

const Search = Input.Search;

@pureRender
class projectMembers extends Component {
    static propTypes = {
        name: PropTypes.string,
        // member: PropTypes.array,
        allMembers: PropTypes.arrayOf(PropTypes.object),
    }
    render() {
        console.log(this.props.allMembers);
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
                        <p><AvatarSelf /></p>
                        <p>{this.props.name}</p>
                        <div className="p-c-o">
                            <a>项目创建者</a>
                        </div>

                    </li>
                    {this.props.allMembers.length ?
                        this.props.allMembers.map(value => (
                            <li className="p-m-list" key={value._id}>
                                <p><AvatarSelf /></p>
                                <p>{value.profile.name}</p>
                                <div style={{ marginLeft: '210px', lineHeight: '70px' }}>
                                    <Icon icon="icon-gengduo" />
                                </div>
                            </li>))
                        : null
                    }
                </ul>
                <div className="ejianlian-add-projectf">
                    <div className="add-button add-button-save" onClick={this.handleChange}>
                                     邀请新成员
                    </div>
                </div>
            </div>
        );
    }
}
export default withTracker((members) => {
    Meteor.subscribe('users');
    console.log(members);
    const { profile = {} } = Meteor.user() || {};
    const { name = '', avatarColor = '', avatar = '' } = profile;
    return {
        name,
        avatarColor,
        avatar,
        allMembers: Meteor.users.find({ _id: { $in: members.member } }).fetch(),
        // allUsers: Meteor.users.find({}).fetch(),
    };
})(projectMembers);
