
import React, { Component } from 'react';
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
    // submitHandler(event) {
    //     event.preventDefault();
    // }
    // onSubmit={this.submitHandler
    // handleCloseResult = (model) => {
    //     this.setState({
    //         model: false
    //     });
    //     console.log(1);
    // }
    // handleClick() {
    //     this.setState({ model: !this.state.model });
    // }
    render() {
        return (
            <div className="ejianlian-project-add" >
                <div className="title">
                    <p>创建项目</p>
                    <MyIcon icon="icon-chuyidong icon" onClick={this.props.click} />
                </div>
                <form>
                    <div className="common-type">
                        <lable htmlFor="name-first"> 项目名称：</lable>
                        <input type="text" placeholder="请输入项目名陈" id="name-first" />
                    </div>
                    <div className="common-type">
                        <lable > 项目简介：</lable>
                        <textarea type="text" placeholder="请输入项目简介" />
                    </div>
                    <div className="common-type">
                        <lable htmlFor="name-first"> 项目名称：</lable>
                        <select default="个人">
                            <option value="私人的">2</option>
                            <option value="公有的">1</option>
                        </select>
                    </div>
                    <div className="common-type">
                        <lable htmlFor="name-first"> 项目名称：</lable>
                        <input type="text" />
                    </div>
                    <div className="common-type">
                        <span> 项目负责人:</span>
                        <MyIcon icon="icon-tianjia" />
                    </div>
                    <div className="common-type">
                        <span>项目参与人：</span>
                        <MyIcon icon="icon-tianjia" />
                    </div>
                    <AddProject value="项目" />
                </form>
            </div >

        );
    }
}
