
import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import PropTypes from 'prop-types';

@pureRender
export default class ProjectAdd extends Component {
    static PropTypes = {
        onClick: PropTypes.func.isRequired,
        submitHandler: PropTypes.func.isRequired,
    }
    // submitHandler(event) {
    //     event.preventDefault();
    // }
    // onSubmit={this.submitHandler
    render() {
        return (
            <div className="ejianlian-add-project">
                <p>创建项目</p>
                <form>
                    项目名称：<input type="text" placeholder="请输入项目名陈" />
                    项目简介：<textarea type="text" placeholder="请输入项目简介" />
                    项目归属：<select default="个人">
                        <option value="私人的">2</option>
                        <option value="公有的">1</option>
                    </select>
                    项目模板：<input type="text" />
                    项目负责人：<input type="checkbox" />
                    项目参与人：<input type="checkbox" />
                </form>
            </div>
        );
    }
}
