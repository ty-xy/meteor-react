
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Input, Select, Upload, message } from 'antd';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import MyIcon from '../../../components/Icon';
// import AddProject from './Addproject';

const Option = Select.Option;

// function getBase64(img) {
//     const reader = new FileReader();
//     reader.addEventListener('load', () => callback(reader.result));
//     const base64 = reader.readAsDataURL(img);
//     return bases64;
// }
function beforeUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
        message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
}
@pureRender
export default class ProjectAdd extends Component {
    static propTypes = {
        click: PropTypes.func,
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

    render() {
        const imageUrl = this.state.imageUrl;
        return (
            <div className="ejianlian-project-add" >
                <div id="title-f">
                    创建项目
                </div>
                <div className="enjianlian-form">
                    <div className="common-type person-type">
                        <span>项目头像：</span >
                        {/* <input type="file"  style={{width:'100px',backgroundColor:'red'}} value="1323e4324"/> */}
                        <Upload
                            className="avatar-uploader"
                            name="avatar"
                            showUploadList={false}
                            action="#"
                            beforeUpload={beforeUpload}
                            onChange={this.handleUp}
                        >
                            {
                                imageUrl ?
                                    <img src={imageUrl} alt="" className="avatar" /> :
                                    <p className="icon-person">
                                        <MyIcon icon="icon-xiangmu icon" />
                                    </p>
                            }
                        </Upload>
                        <span>点击切换头像</span>
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
