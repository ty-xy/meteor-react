import React from 'react';
import PropTypes from 'prop-types';

export default function NoticeSound({ isPlay }) {
    return (
        <audio src="http://oxldjnom8.bkt.clouddn.com/notice.mp3" className="notice-sound" autoPlay={isPlay} />
    );
}
NoticeSound.propTypes = {
    isPlay: PropTypes.bool.isRequired,
};
