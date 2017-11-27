
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Input, Select, Tooltip, Form } from 'antd';

import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import uuid from 'uuid';

import MyIcon from '../../../components/Icon';
import Company from '../../../../schema/company';
import ImgUp from '../ProjectWindow/ProjectBord/component/imgUp';
import AvatarSelf from '../../../components/AvatarSelf';
import ChoosePeopleModel from '../../../components/ChoosePeopleModel';
import PeopleList from '../../manage/audit/component/PeopleList';


const Option = Select.Option;
const text = <span>点击切换头像</span>;
const j = Math.floor(Math.random() * 4);
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};
@pureRender
class ProjectAdd extends Component {
    static propTypes = {
        click: PropTypes.func,
        history: PropTypes.object,
        // to: PropTypes.string,
    }
    constructor(props) {
        super(props);
        this.state = {
            temperature: '',
            intro: '',
            affiliation: '',
            icon: ['icon-dingweichengshi', 'icon-scenery', 'icon-shandong', 'icon-jingdian-simiao'],
            color: ['#7986CB', '#4DB6AC', '#9575CD', '#F06292'],
            showImage: true,
            img: '',
            requireGroupNotice: false, // 必填项错误信息是否提示
            approvers: [], // 选择的审核对象
            copy: [],
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
    }
    handleChangeT = (value) => {
        this.setState({ affiliation: `${value}` });
    }
    handleMessage = () => {
        this.createProject();
    }
    changeUpdateTitle = () => {
        this.setState({
            showImage: false,
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
                members: this.state.copy,
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
        console.log(this.props);
        const { visiblecopy, copy, requireGroupNotice } = this.state;
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
                    <div className="common-type">
                        <label htmlFor="name-first"> 项目名称：</label>
                        <Input
                            type="text"
                            style={{ height: '34.5px', width: '292px' }}
                            placeholder="请输入项目名称"
                            id="name-first"
                            value={this.state.temperature}
                            onChange={this.handleChange.bind(this, 'temperature')}
                        />
                    </div>

                    <div className="common-type">
                        <label htmlFor="name-second"> 项目简介：</label>
                        <Input
                            type="Input.TextArea"
                            placeholder="请输入项目简介"
                            style={{ height: '69px', width: '292px' }}
                            id="name-second"
                            value={this.state.intro}
                            onChange={this.handleChange.bind(this, 'intro')}
                        />
                    </div>
                    <div className="common-type">
                        <label htmlFor="name-third" >项目归属：</label>
                        <Select
                            value={this.state.affiliation}
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
                        <Select defaultValue="不使用" style={{ width: '292px' }} onChange={this.handleChangeT} id="name-third">
                            <Option value="不使用">不使用</Option>
                            <Option value="企业">使用模板 </Option>
                        </Select>
                    </div>
                    <div className="common-type">
                        <span> 项目负责人:</span>
                        <AvatarSelf />
                    </div>
                    <div>
                        <ChoosePeopleModel
                            visible={visiblecopy}
                            cancel={this.handleCancel}
                            ok={this.handleOk}
                            keyword="copy"
                            defaultValue={copy || []}
                            modelTitle="项目组成员"
                        >
                            <FormItem
                                {...formItemLayout}
                                label="项目组成员"
                            >
                                <a href="" onClick={this.showModal} style={{ color: 'rgb(204, 204, 204)' }} >对方过后就</a>
                                <PeopleList
                                    keyword="copy"
                                    iconTitle="项目组成员"
                                    componentSelectedUser={copy || []}
                                    showModal={this.showModal}
                                    handleGroupChange={this.handleGroupChange}
                                    handlePeopleChange={this.handlePeopleChange}
                                    requiredErr="审批人必选"
                                    required={requireGroupNotice}
                                    {...this.props}
                                    {...this.state}
                                />
                            </FormItem>
                        </ChoosePeopleModel>
                    </div>
                    <div className="ejianlian-add-projectf" onClick={this.props.click}>
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
    Meteor.subscribe('project');
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
})(ProjectAdd);

