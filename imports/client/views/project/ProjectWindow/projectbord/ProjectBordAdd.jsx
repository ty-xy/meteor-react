import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import MyIcon from '../../../../components/Icon';
import ProjectBordItem from './projectBordItem';

@pureRender
class ProjectBordList extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            IsShowAdd: false,
        };
    }
    handleClick = () => {
        this.setState({
            IsShowAdd: !this.state.IsShowAdd,
        });
        console.log(this.state.IsShowAdd);
    }

    render() {
        return (
            <div>
                <div className="ejianlian-add-item-bar">
                    <MyIcon icon="icon-jiahao" onClick={this.handleClick} />
                    <p>添加任务版</p>
                </div>
                {this.state.IsShowAdd ? <ProjectBordItem /> : null}
            </div>
        );
    }
}

export default ProjectBordList;
