
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
        to: PropTypes.string,
    }
    constructor(props) {
        super(props);
        //  this.handleChange = this.handleChange.bind(this);
        this.state = {
            temperature: '',
            intro: '',
            affiliation: '',
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
        console.log(1);
    }
    selectFile = () => {
        const file = this.fileInput.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onloadend = function () {
            Meteor.call('sendFile', this.result, this.props.to, (err) => {
                if (err) {
                    return console.error(err.reason);
                }
                console.log('发送文件成功');
            });
        };
        reader.readAsArrayBuffer(file);
    }
    render() {
        //  const imageUrl = this.state.imageUrl;
        return (
            <div className="ejianlian-project-add" >
                <div id="title-f">
                    创建项目
                </div>
                <div className="enjianlian-form">
                    <div className="common-type person-type">
                        <span>项目头像：</span >
                        <Tooltip placement="right" title={text}>
                            <p className="icon-person">
                                <MyIcon icon="icon-xiangmu icon" onClick={this.sendFile} />
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
