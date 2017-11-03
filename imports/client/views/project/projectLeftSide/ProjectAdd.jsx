
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Input, Select, Tooltip } from 'antd';

import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import MyIcon from '../../../components/Icon';
// import AddProject from './Addproject';

const Option = Select.Option;
const text = <span>点击切换头像</span>;
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
        };
    }

    // handleUp = (info) => {
    //     if (info.file.status === 'done') {
    //         // Get this url from response in real world.
    //         const image = getBase64(info.file.originFileObj);
    //         // console.log(image)
    //     }
    // console.log(imageUrl)
    // }

    handleChange(name, e) {
        const newState = {};
        newState[name] = e.target.value;
        this.setState(newState);
        console.log(newState);
    }
    handleChangeT = (value) => {
        this.setState({ affiliation: `${value}` });
        // alert(`${value}`);
    }
    handleMessage = () => {
        this.createProject();
    }
    createProject = () => {
        console.log(this.state.affiliation);
        Meteor.call(
            'createGroup1',
            {
                name: this.state.temperature,
                intro: this.state.intro,
                affiliation: this.state.affiliation,
            },
            (err) => {
                console.log(err);
            },
        );
    }
    sendFile = () => {
        this.fileInput.click();
    }
    // selectFile = () => {
    //     const file = this.fileInput.files[0];
    //     if (!file) {
    //         return;
    //     }
    //     const reader = new FileReader();
    //     const name = file.name;
    //     const fileType = file.type;
    //     const type = fileType.slice(fileType.lastIndexOf('/') + 1) || '';
    //     const size = file.size;
    //     const sendMessage = this.sendMessage;

    //     reader.onloadend = function () {
    //         Meteor.call('insertFile', name, type, size, this.result, (err, res) => {
    //             feedback.dealError(err);
    //             sendMessage(res, 'file');
    //         });
    //     };
    //     reader.readAsDataURL(file);
    // }
    render() {
        const j = Math.floor(Math.random() * 4);
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
                            <p className="icon-person" style={divStyle}>
                                <MyIcon icon={this.state.icon[j]} size="30px" iconColor="#fff" onClick={this.sendFile} />
                                <input
                                    id="i-file"
                                    type="file"
                                    ref={i => this.fileInput = i}
                                    onChange={this.selectFile}
                                />
                            </p>
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
                        <div className="add-button" onClick={this.handleMessage}>
                            {/* <input type="button" value="创建项目" >' */}
                            创建
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
