
import React, { Component } from 'react';
import { Input } from 'antd';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';
import MyIcon from '../../../components/Icon';
import AddProject from './Addproject';

// import { Form, Button, Checkbox } from 'antd';
@pureRender
export default class ProjectAdd extends Component {
    static propTypes = {
        click: PropTypes.func,
        // submitHandler: PropTypes.func,
        // style: PropTypes.string,
    }
    constructor(...arg) {
        super(...arg);
        this.state = {
            // model: false,
            // isShowFriendInfo: true,           
        };
    }
    render() {
        return (
            <div className="ejianlian-project-add" >
                <div id="title-f">
                    创建项目
                </div>
                <form>
                    <div className="common-type">
                        <lable htmlFor="name-first"> 项目名称：</lable>
                        <Input type="text" placeholder="请输入项目名陈" id="name-first" />
                    </div>
                    <div className="common-type">
                        <lable > 项目简介：</lable>
                        <Input type="Input.TextArea" placeholder="请输入项目简介" />
                    </div>
                    <div className="common-type">
                        <span>项目名:</span>
                        <select default="个人">
                            <option value="私人的">2</option>
                            <option value="公有的">1</option>
                        </select>
                    </div>
                    <div className="common-type">
                        <lable htmlFor="name-first">项目模板:</lable>
                        <MyIcon icon="icon-tianjia" />
                    </div>
                    <div className="common-type">
                        <span> 项目负责人:</span>
                        <MyIcon icon="icon-tianjia" />
                    </div>
                    <div className="common-type">
                        <span>项目参与人：</span>
                        <MyIcon icon="icon-tianjia" />
                    </div>
                    <AddProject value="创建" onClick={this.props.click} />
                </form>
            </div>
        );
    }
}
