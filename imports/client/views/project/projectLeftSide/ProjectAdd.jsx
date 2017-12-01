
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Input, Select, Tooltip, Modal } from 'antd';

import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import uuid from 'uuid';

import MyIcon from '../../../components/Icon';
import Company from '../../../../schema/company';
import UserUtil from '../../../../util/user';
import ImgUp from '../ProjectWindow/ProjectBord/component/imgUp';
import Avatar from '../../../components/Avatar';
import AvatarSelf from '../../../components/AvatarSelf';
import SelectMembers from '../../../features/SelectMembers';
// import ChoosePeopleModel from '../../../components/ChoosePeopleModel';
// import PeopleList from '../../manage/audit/component/PeopleList';

const { TextArea } = Input;
const Option = Select.Option;
const text = <span>点击切换头像</span>;
const j = Math.floor(Math.random() * 4);
@pureRender
class ProjectAdd extends Component {
    static propTypes = {
        click: PropTypes.func,
        history: PropTypes.object,
        team: PropTypes.array,
        // to: PropTypes.string,
    }
    constructor(props) {
        super(props);
        this.state = {
            temperature: '',
            intro: '',
            affiliation: '',
            moudle: '',
            icon: ['icon-dingweichengshi', 'icon-scenery', 'icon-shandong', 'icon-jingdian-simiao'],
            color: ['#7986CB', '#4DB6AC', '#9575CD', '#F06292'],
            showImage: true,
            img: '',
            requireGroupNotice: false, // 必填项错误信息是否提示
            approvers: [], // 选择的审核对象
            copy: [],
            showName: false,
            showIntro: false,
            showSelect: false,
        };
    }
    componentWillMount() {
        this.setState({
            uuids: uuid.v4(),
        });
    }
    componentDidMount() {
        console.log(this.state.uuids);
    }
    componentWillReceiveProps() {
        this.setState({
            uuids: uuid.v4(),
        });
    }
    handleChange(name, e) {
        const newState = {};
        newState[name] = e.target.value;
        this.setState(newState);
        if (name === 'temperature') {
            this.setState({
                showName: false,
            });
        }
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
    handleChangeT = (value) => {
        this.setState({ affiliation: `${value}` });
    }
    handleChangeTt = (value) => {
        this.setState({ moudle: `${value}` });
    }
    handleMessage = () => {
        if (this.state.temperature !== '') {
            this.createProject();
        } else {
            this.setState({
                showName: true,
            });
        }
    }
    changeUpdateTitle = () => {
        this.setState({
            showImage: false,
        });
    }
    confirmSelected = (members) => {
        // console.log('选择加入的人员', members);
        const selectMembers = members;
        this.setState({
            selectMembersId: members,
            selectMembers: selectMembers.map(_id => Meteor.users.findOne({ _id })),
            showSelect: false,
        });
    }
    createProject = () => {
        const _this = this;
        console.log('createProject', _this);

        Meteor.call(
            'createGroup1',
            {
                name: this.state.temperature,
                intro: this.state.intro,
                affiliation: this.state.affiliation,
                headPortrait: this.state.showImage ? this.state.icon[j] : this.state.img[0],
                members: this.state.selectMembersId,
                uprojectId: this.state.uuids,
            },
            (err) => {
                if (err) {
                    console.log(err);
                    return false;
                }
                const pathname = `/project/task/${_this.state.uuids}`;
                _this.props.history.push({ pathname });
                _this.setState({
                    temperature: '',
                    intro: '',
                    affiliation: '',
                    headPortrait: '',
                });
            },
        );
    }
    showModal = (e, keyword) => {
        e.preventDefault();
        this.setState({
            [`visible${keyword}`]: true,
        });
    }
    handleCancel = (e, keyword) => {
        e.preventDefault();
        this.setState({
            [`visible${keyword}`]: false,
            checked: false,
        });
    }
    // 选中的人
    handleOk = (keyword, leftUsers) => {
        this.setState({ [keyword]: leftUsers, [`visible${keyword}`]: false, requireGroupNotice: false });
    }
    // 选中后删除
    handlePeopleChange = (e, id, keyword) => {
        e.preventDefault();
        const res = this.state[keyword];
        const peos = res.filter(item => (item !== id));
        this.setState({ [keyword]: peos });
    }
    // 图片id返回
    changeUpdate = (name, imgs) => {
        // const img = [];
        // const file = [];
        console.log('changeUpdate', name, imgs);
        // const { img, file } = this.state;
        if (name === 'img') {
            this.setState({ img: imgs });
        }
        if (name === 'file') {
            this.setState({ file: imgs });
        }
    }
    // 删除图片
    removeUpload = (imgs, keyword) => {
        this.setState({ [keyword]: imgs });
    }
    render() {
        const divStyle = {
            background: this.state.color[j],
        };
        console.log(this.state.selectMembersId);
        return (
            <div className="ejianlian-project-add" >
                <div id="title-f">
                    创建项目
                </div>
                <div className="enjianlian-form">
                    <div className="common-type person-type">
                        <span>项目头像：</span >
                        <Tooltip placement="right" title={text}>
                            {this.state.showImage ?
                                <p className="icon-person" style={divStyle} onClick={this.changeUpdateTitle}>
                                    <MyIcon icon={this.state.icon[j]} size={30} iconColor="#fff" />
                                </p> :
                                <ImgUp keyword="img" className="img-title" fileList={[]} changeUpdate={this.changeUpdate} removeUpload={this.removeUpload}{...this.props} />}
                        </Tooltip>
                    </div>
                    <div className="common-type ">
                        <label htmlFor="name-first"> 项目名称：</label>
                        <Input
                            type="text"
                            style={{ height: '34.5px', width: '292px' }}
                            placeholder="请输入项目名称"
                            id="name-first"
                            value={this.state.temperature}
                            onChange={this.handleChange.bind(this, 'temperature')}
                        />
                        <div style={{ height: '20px' }}>
                            <p
                                style={{ display: this.state.showName ? 'block' : 'none' }}
                                className="input-name"
                            >请输入项目名称</p>
                        </div>
                    </div>

                    <div className="common-type common-input">
                        <label htmlFor="name-second" > 项目简介：</label>
                        <TextArea
                            placeholder="请输入项目简介"
                            style={{ height: '69px', width: '292px', verticalAlign: 'middle' }}
                            id="name-second"
                            value={this.state.intro}
                            onChange={this.handleChange.bind(this, 'intro')}
                        />
                    </div>
                    <div className="common-type common-input">
                        <label htmlFor="name-third" >项目归属：</label>
                        <Select
                            value={this.state.affiliation || '1'}
                            style={{ width: '292px' }}
                            onChange={this.handleChangeT}
                            id="name-third"
                        >
                            <Option value="1">私有
                                <p>仅项目成员可看和编辑</p>
                            </Option>
                            <Option value="2">企业
                                <p>企业内所有成员看见，仅项目成员可编辑</p>
                            </Option>
                        </Select>
                    </div>
                    <div className="common-type">
                        <label htmlFor="name-third" >项目归属：</label>
                        <Select defaultValue="不使用" style={{ width: '292px' }} onChange={this.handleChangeTt} id="name-third">
                            <Option value="不使用">不使用</Option>
                            <Option value="企业">模版创建 </Option>
                        </Select>
                    </div>
                    <div className="common-type">
                        <span> 项目负责人:</span>
                        <AvatarSelf />
                    </div>
                    <div>
                        <div className="add-members common-type" onClick={this.handleAddMembers}>
                            <div> 项目成员:</div>
                            <div style={{ display: 'flex' }}>
                                <MyIcon icon="icon-tianjia3 icon" size={35} />
                                {
                                    this.state.selectMembers && this.state.selectMembers.map(user => (
                                        user ?
                                            <Avatar key={user._id} avatarColor={user.profile && user.profile.avatarColor} name={user.profile && user.profile.name} avatar={user.profile && user.profile.avatar} />
                                            :
                                            null
                                    ))
                                }
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
                    <div
                        className="ejianlian-add-projectf"
                        onClick={this.state.temperature !== '' ? this.props.click : null}
                    >
                        <div className="add-button add-button-create" onClick={this.handleMessage}>
                            {/* <input type="button" value="创建项目" >' */}
                            创建
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default withTracker(() => {
    Meteor.subscribe('company');
    Meteor.subscribe('users');
    // const currentCompany = Company.findOne({ _id: currentCompanyId });
    const friendIds = UserUtil.getFriends();
    const companyIds = UserUtil.getCompanyList();
    // const companyInfo = {};
    const companyList = companyIds.map(_id =>
        Company.findOne({ _id }),
    );
    // const companyInfo = {};
    // companyList.forEach((item) => {
    //     if (item) {
    //         companyInfo.name = item.name;
    //         companyInfo.members = item.members;
    //     }
    // });

    companyList.map((item) => {
        const members = [];
        for (const value of Object.values(item.members)) {
            members.push(value.userId);
        }
        return members;
    });

    console.log(companyIds, companyList);
    const team = [
        {
            name: 'e建联好友',
            members: friendIds,
            department: [], // 不存在的时候需要传一个空数组
        },
        // {
        //     name: companyList[0].name,
        //     members,
        //     department: [
        //         // {
        //         //     name: '技术部',
        //         //     members: [
        //         //         // 成员
        //         //         'kfFea3wBriB48DPpM',
        //         //     ],
        //         // },
        //         // {
        //         //     name: '产品部',
        //         //     members: [
        //         //         // 成员
        //         //         'Agvq9dmbsXNFtBcwi',
        //         //     ],
        //         // },
        //     ],
        // },
    ];
    return {
        // members,
        team,
    };
    // Meteor.subscribe('company');
    // Meteor.subscribe('users');
    // Meteor.subscribe('project');
    // const companys = Company.find().fetch();
    // const mainCompany = Meteor.user() && Meteor.user().profile.mainCompany;
    // let companyInfo = {};
    // companys.forEach((item) => {
    //     if (item._id === mainCompany) {
    //         companyInfo = item;
    //     }
    // });
    // return {
    //     companyInfo,
    //     companys,
    //     allUsers: Meteor.users.find().fetch(),
    // };
})(ProjectAdd);

