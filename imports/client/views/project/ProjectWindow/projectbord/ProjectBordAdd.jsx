import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Input, Button } from 'antd';
import MyIcon from '../../../../components/Icon';
// import ProjectBordItem from './projectBordItem';

@pureRender
class ProjectBordList extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            IsShowAdd: false,
            minchen: '',
        };
    }
    handleClick = () => {
        this.setState({
            IsShowAdd: !this.state.IsShowAdd,
            minchen: '',
        });
        console.log(this.state.IsShowAdd);
    }
    handleChange = (e) => {
        this.setState({
            minchen: e.target.value,
        });
        console.log(this.state.minchen);
    }
    render() {
        return (
            <div>
                <div className="ejianlian-add-item-bar">
                    <MyIcon icon="icon-jiahao" onClick={this.handleClick} />
                    <p>添加任务版</p>
                </div>
                {this.state.IsShowAdd ?
                    <div className="ejianlian-project-item">
                        <div className="project-input">
                            <Input
                                style={{ width: 225, height: 40 }}
                                placeholder="任务版名称"
                                value={this.state.minchen}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="project-button">
                            <button onClick={this.handleClick}>取消</button>
                            <Button type="primary" onClick={this.handleClick}>确认</Button>
                        </div>
                    </div> : null}
            </div>
        );
    }
}

export default ProjectBordList;
