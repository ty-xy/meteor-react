import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pureRender from 'pure-render-decorator';

@pureRender
class NoticeSound extends Component {
    static propTypes = {
        playSound: PropTypes.bool,
    };
    componentWillUpdate(nextProps) {
        if (nextProps.playSound && this.props.playSound !== nextProps.playSound) {
            this.sound.play();
        }
    }
    render() {
        return (
            <audio
                ref={sound => this.sound = sound}
                className="notice-sound"
            >
                <source src="/sounds/message_sound.mp3" type="audio/mp3" />
                <source src="/sounds/message_sound.ogg'" type="audio/ogg" />
                <source src="/sounds/message_sound.wav" type="audio/wav" />
            </audio>
        );
    }
}

export default NoticeSound;
