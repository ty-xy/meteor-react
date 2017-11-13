import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NoticeSound extends Component {
    static propTypes = {
        playSound: PropTypes.bool,
    };
    componentWillUpdate(nextProps) {
        if (nextProps.playSound && this.props.playSound !== nextProps.playSound) {
            this.sound.play();
            // ui.playSound(false);
        }
    }
    render() {
        return (
            <div>
                <audio
                    ref={sound => this.sound = sound}
                    className="notice-sound"
                >
                    <source src="http://oxldjnom8.bkt.clouddn.com/notice.mp3" type="audio/mp3" />
                </audio>
            </div>
        );
    }
}

export default NoticeSound;
