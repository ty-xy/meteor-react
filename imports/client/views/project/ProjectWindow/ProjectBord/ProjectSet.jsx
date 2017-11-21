import React, { Component } from 'react';
import { Input, Select, Tooltip } from 'antd';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import AvatarSelf from '../../../../components/AvatarSelf';
import MyIcon from '../../../../components/Icon';
import ImgUpload from '../../../manage/component/ImgUpload';
import Project from '../../../../../../imports/schema/project';

// import GroupSelect from '../../../manage/audit/component/GroupSelect';

const Option = Select.Option;
const text = <span>点击切换头像</span>;
@pureRender
class ProjectSet extends Component {
    static propTypes = {
        projects: PropTypes.arrayOf(PropTypes.object),
        setId: PropTypes.string,
    }
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            intro: '',
            affiliation: '',
            headPortrait: '',
        };
    }
    componentWillMount() {
        console.log('componentWillMount', this.props.projects);
        const item = this.props.projects[0];
        this.setState({
            name: item.name,
            intro: item.intro,
            affiliation: item.affiliation,
            headPortrait: item.headPortrait,
        });
    }
    componentWillReceiveProps(nextProps) {
        const nextItem = nextProps.projects[0];
        this.setState({
            name: nextItem.name,
            intro: nextItem.intro,
            affiliation: nextItem.affiliation,
            headPortrait: nextItem.headPortrait,
        });
    }
    handleProject=() => {
        Meteor.call(
            'deleteProject', this.props.setId,
            (err) => {
                console.log(err);
            },
        );
    }
    handlechangePig=() => {
        Meteor.call(
            'changePig', this.props.setId, 2,
            (err) => {
                console.log(err);
            },
        );
    }
    handleChangeInput(name, e) {
        const newState = {};
        newState[name] = e.target.value;
        this.setState(newState);
    }
    handleChange = () => {
        Meteor.call(
            'changeProject',
            this.props.setId,
            this.state.name,
            this.state.intro,
            this.state.affiliation,
            this.state.headPortrait,
            (error) => {
                console.log(error);
            },
        );
    }
    // 改变属性
    handleChangeT = (value) => {
        this.setState({ affiliation: `${value}` });
        // alert(`${value}`);
    }
    changeUpdate = (name, imgs) => {
        console.log('changeUpdate', name, imgs);
        if (name === 'img') {
            this.setState({ headPortrait: imgs[0] });
        }
        if (name === 'file') {
            this.setState({ file: imgs });
        }
    }
    // 删除图片
    removeUpload = (imgs, keyword) => {
        this.setState({ [keyword]: imgs });
    }
    handleTitle=(item) => {
        if (item.indexOf('icon') === -1) {
            return (<img
                src={`http://oxldjnom8.bkt.clouddn.com//${item}`}
                alt=""
                style={{ width: '60px', height: '60px', borderRadius: '50%' }}
            />);
        }
        return <MyIcon icon={`${item} icon`} size="30px" />;
    }
    render() {
        console.log(this.props.setId);
        return (<div className="ejianlian-project-add project-setting" >
            <div id="title-f">
            创建项目
            </div>
            {/* {this.props.projects.map((value, index) => {
                console.log(11111);
                return ( */}
            <div className="enjianlian-form" >
                <div className="common-type person-type">
                    <span>项目头像：</span >
                    <Tooltip placement="right" title={text}>
                        {this.handleTitle(this.state.headPortrait)}
                        <ImgUpload
                            keyword="img"
                            className="img-title"
                            fileList={[]}
                            changeUpdate={this.changeUpdate}
                            removeUpload={this.removeUpload}
                            {...this.props}
                        />
                    </Tooltip>
                </div>
                <div className="common-type">
                    <label htmlFor="name-first"> 项目名称：</label>
                    <Input
                        type="text"
                        style={{ height: '34.5px', width: '292px' }}
                        value={this.state.name}
                        onChange={this.handleChangeInput.bind(this, 'name')}
                        placeholder="请输入项目名称"
                        id="name-first"
                    />
                </div>

                <div className="common-type">
                    <label htmlFor="name-second"> 项目简介：</label>
                    <Input
                        type="Input.TextArea"
                        placeholder="请输入项目简介"
                        value={this.state.intro}
                        onChange={this.handleChangeInput.bind(this, 'intro')}
                        style={{ height: '69px', width: '292px' }}
                        id="name-second"
                    />
                </div>
                <div className="common-type">
                    <label htmlFor="name-third" >项目归属：</label>
                    <Select
                        style={{ width: '292px' }}
                        onChange={this.handleChangeT}
                        id="name-third"
                        Value={this.state.affiliation}
                    >
                        <Option value="1">私有
                            <p>仅项目成员可看和编辑</p>
                        </Option>
                        <Option value="2">企业
                            <p>企业内所有成员看见，仅项目成员可编辑</p>
                        </Option>
                    </Select>
                </div>
                {/* <div className="common-type">
                            <span> 项目创建者:</span>
                            <AvatarSelf />
                        </div>
                        <div className="common-type">
                            <GroupSelect
                                label="项目参与人"
                            />
                        </div> */}

                <div className="ejianlian-add-projectf">
                    <div className="add-button add-button-save" onClick={this.handleChange}>
                                      保存修改
                    </div>
                    <Link to="/project">
                        <div className="add-button add-button-delete" onClick={this.handleProject}>
                                       删除该项目
                        </div>
                    </Link>
                    <Link to="/project">
                        <div className="add-button add-button-back" onClick={this.handlechangePig}>
                            <MyIcon icon="icon-guidangxiangmu icon-guidang" />归档该项目
                        </div>
                    </Link>
                </div>
            </div>
        </div>);
    }
}

export default withTracker((o) => {
    Meteor.subscribe('project');
    const projects = Project.find({ _id: o.setId }).fetch();
    console.log(projects);
    return {
        projects,
        // taskId
    };
})(ProjectSet);
