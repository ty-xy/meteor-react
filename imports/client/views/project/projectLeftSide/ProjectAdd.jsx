
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Input, Select, Tooltip } from 'antd';

import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import MyIcon from '../../../components/Icon';
import ImgUpload from '../../manage/component/ImgUpload';
// import AddProject from './Addproject';

const Option = Select.Option;
const text = <span>点击切换头像</span>;
const j = Math.floor(Math.random() * 4);
@pureRender
export default class ProjectAdd extends Component {
    static propTypes = {
        click: PropTypes.func,
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
        };
    }

    handleChange(name, e) {
        const newState = {};
        newState[name] = e.target.value;
        this.setState(newState);
        console.log(newState);
        console.log(this.state.icon[j]);
    }
    handleChangeT = (value) => {
        this.setState({ affiliation: `${value}` });
        // alert(`${value}`);
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
        console.log(this.state.affiliation);
        Meteor.call(
            'createGroup1',
            {
                name: this.state.temperature,
                intro: this.state.intro,
                affiliation: this.state.affiliation,
                headPortrait: this.state.showImage ? this.state.icon[j] : this.state.img[0],
            },
            (err) => {
                console.log(err);
            },
        );
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
                                <ImgUpload keyword="img" className="img-title" fileList={[]} changeUpdate={this.changeUpdate} removeUpload={this.removeUpload}{...this.props} />}
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
                            Value={this.state.affiliation}
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
                        <MyIcon icon="icon-tianjia icon-add" />
                    </div>
                    <div className="common-type">
                        <span>项目参与人:</span>
                        <MyIcon icon="icon-tianjia icon-add" />
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
