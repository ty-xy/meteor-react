import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { DragDropContext } from 'react-dnd';

import ProjectBordItem from './projectBordItem';
// import CustomDragLayer from './CustomDragLayer';
import TaskBoard from '../../../../../schema/taskBoard';
import ProjectBordAdd from './ProjectBordAdd';

@pureRender
class Board extends Component {
    static propTypes = {
        taskF: PropTypes.arrayOf(PropTypes.object),
        pId: PropTypes.string,
    }
    render() {
        const divStyle = {
            TabStyle: {
                display: 'flex',
                marginTop: '10px',
            },
        };
        return (
            <div style={divStyle.TabStyle}>
                {/* <CustomDragLayer snapToGrid={false} /> */}
                { this.props.taskF.map(text => (
                    <ProjectBordItem
                        value={text.name}
                        tastBoardId={text._id}
                        key={text._id}
                        projectId={text.projectId}
                    />
                ))}
                <ProjectBordAdd pId={this.props.pId} />
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(withTracker((projectd) => {
    Meteor.subscribe('taskboard');
    const taskF = TaskBoard.find({ projectId: projectd.pId }).fetch();
    const taskL = taskF.length;
    console.log(projectd, taskF);
    return {
        taskF,
        taskL,
        projectd,
    };
})(Board));
